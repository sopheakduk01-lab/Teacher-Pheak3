const fs = require("fs");
const path = require("path");

const bundlePath = path.join(process.cwd(), "public", "assets", "index-BwPwHqBe.js");
let code = fs.readFileSync(bundlePath, "utf8");

const students46Raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "students_46.json"), "utf8"));
const csv46 = fs.readFileSync(path.join(process.cwd(), "scripts", "students_46.csv"), "utf8");

// Convert students_46.json into full app student objects matching kde/EXACT_46 schema
const fullStudents46 = students46Raw.map((s, idx) => {
  const eth = s.ethnicity || "ខ្មែរ";
  const dis = s.disability || "មិនមាន";
  return {
    id: idx + 1,
    rollNo: s.rollNo || idx + 1,
    name: s.name,
    gender: s.gender,
    dob: s.dob,
    pob: s.pob || "",
    fatherName: s.fatherName || "",
    fatherJob: s.fatherJob || "",
    motherName: s.motherName || "",
    motherJob: s.motherJob || "",
    address: s.address || s.pob || "",
    ethnicity: eth,
    disability: dis,
    indigenousEthnicity: eth && eth !== "ខ្មែរ" && eth !== "មិនមាន" && eth !== "គ្មាន" ? eth : "",
    familyStatus: "ទូទៅ",
    note: s.note || "",
    civilId: `SIS-${1001 + idx}`,
    parentPhone: "012 345 678",
    plpAccount: `student${idx + 1}@plp.edu.kh`,
    pin: "1234"
  };
});

// 1. Replace kde=[...] cleanly keeping ,eP=...
const kdeMarker = ",kde=[";
const kdeStart = code.indexOf(kdeMarker);
const kdeEnd = code.indexOf(",eP=new Date()", kdeStart);
if (kdeStart === -1 || kdeEnd === -1) {
  throw new Error(`Could not locate kde boundaries: start=${kdeStart}, end=${kdeEnd}`);
}
code = code.slice(0, kdeStart) + ",kde=" + JSON.stringify(fullStudents46) + code.slice(kdeEnd);
console.log("1. Updated kde (46 students, 23 female).");

// 2. Bump localStorage migration key so browser upgrades cleanly to the 100% audited 46 list
const oldMigKey = "migrated_moeys_46_students_6k_v100";
const newMigKey = "migrated_moeys_46_students_6k_v102";
if (!code.includes(oldMigKey)) {
  throw new Error("Could not find oldMigKey");
}
code = code.replace(oldMigKey, newMigKey);
console.log("2. Updated migration key to", newMigKey);

// 3. Replace X2 .. wtt block with hardened 100% parser, CSV/TSV/HTML-table/Excel reader, EXACT_46, SS, doe, wtt
const blockStart = code.indexOf("function X2(");
const blockEnd = code.indexOf(";const ytt=", blockStart);
if (blockStart === -1 || blockEnd === -1) {
  throw new Error(`Could not locate X2..wtt block: start=${blockStart}, end=${blockEnd}`);
}

const exact46Json = JSON.stringify(fullStudents46);
const ssJson = JSON.stringify(csv46);

const newParserAndIoBlock = `function normKh(str){if(str===null||str===void 0)return"";return String(str).replace(/[\\u200B-\\u200D\\uFEFF]/g,"").replace(/\\u00A0/g," ").replace(/[\\r\\n\\t]+/g," ").replace(/ {2,}/g," ").trim()}function X2(r){const t=[];let s="",a=!1;if(r.includes("\\t")&&r.split("\\t").length>=3)return r.split("\\t").map(n=>normKh(n.replace(/^["']|["']$/g,"")));if(r.includes(";")&&!r.includes(",")&&r.split(";").length>=3)return r.split(";").map(n=>normKh(n.replace(/^["']|["']$/g,"")));for(let n=0;n<r.length;n++){const i=r[n];i==='"'||i==="'"?a&&r[n+1]===i?(s+=i,n++):a=!a:i===","&&!a?(t.push(normKh(s)),s=""):s+=i}return t.push(normKh(s)),t.map(n=>normKh(n.replace(/^["']|["']$/g,"")))}function toArabicDigits(str){if(str===null||str===void 0)return"";return String(str).replace(/[០-៩]/g,d=>"0123456789"["០១២៣៤៥៦៧៨៩".indexOf(d)])}function R_(r){if(r===null||r===void 0||r==="")return"01/01/2015";if(r instanceof Date&&!isNaN(r.getTime())){const d=String(r.getUTCDate()).padStart(2,"0"),m=String(r.getUTCMonth()+1).padStart(2,"0"),y=r.getUTCFullYear();return\`\${d}/\${m}/\${y}\`}if(typeof r==="number"&&r>1e4&&r<6e4){const d=new Date(Math.round((r-25569)*86400*1e3)),day=String(d.getUTCDate()).padStart(2,"0"),month=String(d.getUTCMonth()+1).padStart(2,"0"),year=d.getUTCFullYear();return\`\${day}/\${month}/\${year}\`}const t=toArabicDigits(normKh(r));if(/^\\d{5}$/.test(t)){const num=Number(t);if(num>1e4&&num<6e4){const d=new Date(Math.round((num-25569)*86400*1e3)),day=String(d.getUTCDate()).padStart(2,"0"),month=String(d.getUTCMonth()+1).padStart(2,"0"),year=d.getUTCFullYear();return\`\${day}/\${month}/\${year}\`}}if(t.includes("GMT")||t.length>25){const d=new Date(t);if(!isNaN(d.getTime())){const day=String(d.getDate()).padStart(2,"0"),month=String(d.getMonth()+1).padStart(2,"0"),year=d.getFullYear();return\`\${day}/\${month}/\${year}\`}}const s=t.match(/^(\\d{1,2})[\\/.\\-](\\d{1,2})[\\/.\\-](\\d{4})$/);if(s)return\`\${s[1].padStart(2,"0")}/\${s[2].padStart(2,"0")}/\${s[3]}\`;const s2=t.match(/^(\\d{1,2})[\\/.\\-](\\d{1,2})[\\/.\\-](\\d{2})$/);if(s2){const yy=Number(s2[3]),yyyy=yy<=35?2e3+yy:1900+yy;return\`\${s2[1].padStart(2,"0")}/\${s2[2].padStart(2,"0")}/\${yyyy}\`}const a=t.match(/^(\\d{4})[\\/.\\-](\\d{1,2})[\\/.\\-](\\d{1,2})$/);if(a)return\`\${a[3].padStart(2,"0")}/\${a[2].padStart(2,"0")}/\${a[1]}\`;return t}function parseStudentRows(rawRows,startIndex=0){if(!rawRows||!rawRows.length)return{students:[],meta:{}};const normRows=rawRows.map(r=>Array.isArray(r)?r.map(c=>c instanceof Date||typeof c==="number"?c:normKh(c)):X2(String(r||""))),meta={};for(let i=0;i<Math.min(25,normRows.length);i++){const rowStr=normRows[i].map(c=>normKh(c)).filter(Boolean).join(" ");if(!rowStr)continue;if(rowStr.includes("សាលាបឋមសិក្សា")||rowStr.includes("សាលា")){const sCell=normRows[i].map(c=>normKh(c)).find(c=>c.includes("សាលា"));meta.schoolName=sCell||"សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល"}if(rowStr.includes("ថ្នាក់")||rowStr.includes("កម្រិត")){const gMatch=toArabicDigits(rowStr).match(/(?:ថ្នាក់[ទី\\s:]*[^\\s,]+(?:\\s*[-–]?\\s*[ក-អA-Za-z0-9]+)?)/);meta.grade=gMatch?gMatch[0]:"ថ្នាក់: 6-ក"}if(rowStr.includes("សរុប")||rowStr.includes("ស្រី")){const arabicStr=toArabicDigits(rowStr),tot=arabicStr.match(/សិស្សសរុប[\\s:]*\\d+[\\s]*នាក់/),fem=arabicStr.match(/ស្រី[\\s:]*\\d+[\\s]*នាក់/);tot&&(meta.totalCount=tot[0]),fem&&(meta.femaleCount=fem[0])}}let hRowIdx=-1,colMap={roll:0,name:1,gender:2,dob:3,pob:4,fatherName:5,fatherJob:6,motherName:7,motherJob:8,address:9,ethnicity:10,disability:11,note:12};for(let r=0;r<Math.min(60,normRows.length);r++){const row=normRows[r],rowText=row.map(c=>normKh(c)).join(" "),hasRoll=rowText.includes("ល.រ")||rowText.includes("ល. រ")||rowText.includes("លរ")||rowText.includes("លេខរៀង")||/\\bno\\b/i.test(rowText),hasName=rowText.includes("នាមត្រកូល")||rowText.includes("គោត្តនាម")||rowText.includes("នាម និង")||rowText.includes("ឈ្មោះសិស្ស")||rowText.includes("ឈ្មោះ")||/\\bname\\b/i.test(rowText),hasGender=rowText.includes("ភេទ")||/\\bgender\\b|\\bsex\\b/i.test(rowText),hasDob=rowText.includes("ថ្ងៃខែឆ្នាំកំណើត")||rowText.includes("ថ្ងៃកំណើត")||/\\bdob\\b/i.test(rowText);if(hasName&&(hasRoll||hasGender||hasDob)){hRowIdx=r;const applyHeaders=hRow=>{let fS=!1,mS=!1;hRow.forEach((col,idx)=>{const h=normKh(col).toLowerCase();if(!h)return;if(h.includes("ល.រ")||h.includes("ល. រ")||h==="លរ"||h==="no"||h==="no."||h.includes("លេខរៀង"))colMap.roll=idx;else if(h.includes("នាមត្រកូល")||h.includes("គោត្តនាម")||h.includes("នាម និង")||(h.includes("ឈ្មោះ")&&!h.includes("ឪពុក")&&!h.includes("ម្តាយ")&&!h.includes("ម្ដាយ"))||h==="name"||h==="fullname"||h==="student name")colMap.name=idx;else if(h.includes("ភេទ")||h==="sex"||h==="gender")colMap.gender=idx;else if((h.includes("កំណើត")&&!h.includes("ទីកន្លែង")&&!h.includes("កន្លែង"))||h==="dob"||h.includes("birth date"))colMap.dob=idx;else if(h.includes("ទីកន្លែង")||h.includes("កន្លែងកំណើត")||h==="pob"||h.includes("place of birth"))colMap.pob=idx;else if(h.includes("ឪពុក")||h.includes("father")){colMap.fatherName=idx,fS=!0}else if(h.includes("មុខរបរ")||h.includes("job")||h.includes("occupation")){if(!mS)colMap.fatherJob=idx;else colMap.motherJob=idx}else if(h.includes("ម្តាយ")||h.includes("ម្ដាយ")||h.includes("mother")){colMap.motherName=idx,mS=!0}else if(h.includes("លំនៅដ្ឋាន")||h.includes("អាសយដ្ឋាន")||h.includes("address")||h.includes("ទីលំនៅ"))colMap.address=idx;else if(h.includes("ជនជាតិ")||h.includes("ក្រីក្រ")||h.includes("ethnicity"))colMap.ethnicity=idx;else if(h.includes("ពិការ")||h.includes("disability"))colMap.disability=idx;else if(h.includes("ផ្សេង")||h.includes("note")||h.includes("remark")||h.includes("សេចក្តីផ្សេងៗ"))colMap.note=idx})};applyHeaders(row);if(r+1<normRows.length){const nextRowText=normRows[r+1].map(c=>normKh(c)).join(" ");if((nextRowText.includes("មុខរបរ")||nextRowText.includes("ឈ្មោះ"))&&!nextRowText.includes("ប្រុស")&&!nextRowText.includes("ស្រី")){applyHeaders(normRows[r+1]);hRowIdx=r+1}}break}}if(hRowIdx===-1){for(let r=0;r<Math.min(20,normRows.length);r++){const row=normRows[r],firstIdx=row.findIndex(c=>normKh(c)!=="");if(firstIdx>0){const offset=firstIdx;colMap={roll:offset,name:offset+1,gender:offset+2,dob:offset+3,pob:offset+4,fatherName:offset+5,fatherJob:offset+6,motherName:offset+7,motherJob:offset+8,address:offset+9,ethnicity:offset+10,disability:offset+11,note:offset+12};break}}}const sRow=hRowIdx>=0?hRowIdx+1:0,students=[];let baseId=Date.now();for(let r=sRow;r<normRows.length;r++){const row=normRows[r];if(!row||!row.length||row.every(c=>!normKh(c)))continue;const rText=row.map(c=>normKh(c)).join(" "),getVal=idx=>idx!==void 0&&row[idx]!==void 0?normKh(row[idx]):"";let name=getVal(colMap.name),rawRoll=getVal(colMap.roll);const isFooter=rText.includes("បានឃើញ")||rText.includes("នាយកសាលា")||rText.includes("គ្រូបន្ទុកថ្នាក់")||rText.includes("ធ្វើនៅ")||rText.includes("ពុទ្ធសករាជ")||rText.includes("ហាស់ សាវិន");if(isFooter&&(!name||name.includes("បានឃើញ")||name.includes("នាយក")||name.includes("គ្រូបន្ទុក")||name.includes("ធ្វើនៅ")))break;if(!name&&rawRoll&&isNaN(parseInt(toArabicDigits(rawRoll),10))){name=rawRoll,rawRoll=""}const cleanDigitsName=toArabicDigits(name);if(!name||name.length<2||/^\\d+$/.test(cleanDigitsName)||name.includes("នាមត្រកូល")||name.includes("គោត្តនាម")||name.includes("ឈ្មោះសិស្ស")||name.includes("សិស្សសរុប")||name.includes("បញ្ជីសិស្ស")||name.includes("ព្រះរាជាណាចក្រ")||name.includes("ជាតិ សាសនា")||name==="ឈ្មោះ")continue;let rollNum=parseInt(toArabicDigits(rawRoll),10);(isNaN(rollNum)||rollNum<=0)&&(rollNum=startIndex+students.length+1);const rawG=getVal(colMap.gender),lowG=rawG.toLowerCase(),gender=rawG.includes("ស្រី")||rawG==="ស"||lowG==="f"||lowG==="female"||lowG==="girl"?"ស្រី":"ប្រុស",rawDobCell=colMap.dob!==void 0?row[colMap.dob]:"",dob=R_(rawDobCell),pob=getVal(colMap.pob),fName=getVal(colMap.fatherName),fJob=getVal(colMap.fatherJob),mName=getVal(colMap.motherName),mJob=getVal(colMap.motherJob),addr=getVal(colMap.address)||pob,rawEth=getVal(colMap.ethnicity),eth=rawEth||"ខ្មែរ",rawDis=getVal(colMap.disability),dis=rawDis||"មិនមាន",note=getVal(colMap.note);students.push({id:baseId++,rollNo:rollNum,name,gender,dob,pob:pob||void 0,fatherName:fName||void 0,fatherJob:fJob||void 0,motherName:mName||void 0,motherJob:mJob||void 0,address:addr||void 0,ethnicity:eth,disability:dis,disabilityType:dis&&dis!=="មិនមាន"&&dis!=="គ្មាន"?dis:void 0,indigenousEthnicity:eth&&eth!=="ខ្មែរ"&&eth!=="មិនមាន"&&eth!=="គ្មាន"?eth:void 0,familyStatus:"ទូទៅ",note:note||void 0,parentPhone:"012 345 678",civilId:\`SIS-\${1e3+startIndex+students.length+1}\`,plpAccount:\`student\${startIndex+students.length+1}@plp.edu.kh\`,pin:"1234"})}return{students,meta}}function zw(r,t=0){if(!r||!r.trim())return{students:[],meta:{}};const s=r.split(/\\r?\\n/).map(d=>X2(d));return parseStudentRows(s,t)}const SS=${ssJson},EXACT_46=${exact46Json};function sheetToRawRows(ws){if(!ws)return[];const ref=ws["!ref"];if(ref&&Gm.decode_range&&Gm.encode_cell){try{const range=Gm.decode_range(ref),rows=[];for(let R=range.s.r;R<=range.e.r;R++){const row=[];for(let C=range.s.c;C<=range.e.c;C++){const addr=Gm.encode_cell({r:R,c:C}),cell=ws[addr];if(!cell){row.push("");continue}if(cell.t==="d"&&cell.v instanceof Date)row.push(cell.v);else if(cell.t==="n"&&typeof cell.v==="number"&&cell.v>1e4&&cell.v<6e4&&cell.z&&/[dmy]/i.test(cell.z))row.push(cell.v);else if(cell.w!==void 0&&cell.w!=="")row.push(String(cell.w));else if(cell.v!==void 0)row.push(cell.v);else row.push("")}rows.push(row)}if(rows.length>0)return rows}catch(e){}}return Gm.sheet_to_json(ws,{header:1,raw:!1,defval:""})}function parseHtmlTableRows(htmlText){try{if(typeof DOMParser<"u"){const doc=new DOMParser().parseFromString(htmlText,"text/html"),trs=Array.from(doc.querySelectorAll("tr"));return trs.map(tr=>{const cells=[];Array.from(tr.querySelectorAll("th,td")).forEach(td=>{const txt=normKh(td.textContent||""),span=Math.max(1,parseInt(td.getAttribute("colspan")||"1",10)||1);cells.push(txt);for(let k=1;k<span;k++)cells.push("")});return cells})}}catch(e){}return[]}async function vtt(r,t=0){const s=await r.arrayBuffer();try{const a=EA(s,{type:"array",cellDates:!1,cellNF:!0});if(a&&a.SheetNames&&a.SheetNames.length>0){const preferred=a.SheetNames.find(h=>h.includes("សិស្ស")||h.includes("ថ្នាក់")||/student|list/i.test(h))||a.SheetNames[0],orderedSheets=[preferred,...a.SheetNames.filter(n=>n!==preferred)];for(const sheetName of orderedSheets){const ws=a.Sheets[sheetName];if(!ws)continue;const rows=sheetToRawRows(ws),parsed=parseStudentRows(rows,t);if(parsed&&parsed.students&&parsed.students.length>0)return parsed}}}catch(e){console.warn("SheetJS parse fallback triggered:",e)}try{const txt=new TextDecoder("utf-8").decode(s);if(/<table|<tr/i.test(txt)){const hRows=parseHtmlTableRows(txt),hParsed=parseStudentRows(hRows,t);if(hParsed&&hParsed.students&&hParsed.students.length>0)return hParsed}const cParsed=zw(txt,t);if(cParsed&&cParsed.students&&cParsed.students.length>0)return cParsed}catch(e2){console.warn("Text/HTML fallback error:",e2)}return{students:[],meta:{}}}function doe(r,t="បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.xlsx",s="សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល",a="6-ក"){const n=r.filter(u=>u.gender==="ស្រី").length,cleanGrade=String(a||"6-ក").replace(/^ថ្នាក់ទី\\s*:?\\s*|^ថ្នាក់\\s*:?\\s*/,"")||"6-ក",i=[["ព្រះរាជាណាចក្រកម្ពុជា"],["ជាតិ សាសនា ព្រះមហាក្សត្រ"],["មន្ទីរអប់រំ យុវជន និងកីឡា រាជធានី/ខេត្ត ខេត្តស្ទឹងត្រែង"],["ការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលក្រុង/ស្រុក/ខណ្ឌ សៀមបូក"],[s||"សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល"],["បញ្ជីសិស្ស"],[\`ថ្នាក់: \${cleanGrade}\`],[\`សិស្សសរុប: \${r.length} នាក់\`,"","","","","","","","","","",\`ស្រី: \${n} នាក់\`,""],["ល.រ","នាមត្រកូល និងនាម","ភេទ","ថ្ងៃខែឆ្នាំកំណើត","ទីកន្លែងកំណើត","ឈ្មោះឪពុក","មុខរបរ","ឈ្មោះម្តាយ","មុខរបរ","លំនៅដ្ឋាន","ក្រុមជនជាតិ","ពិការភាព","សេចក្តីផ្សេងៗ"]],l=r.map((u,h)=>[u.rollNo||h+1,u.name,u.gender,u.dob||"",u.pob||"",u.fatherName||"",u.fatherJob||"",u.motherName||"",u.motherJob||"",u.address||u.pob||"",u.ethnicity||u.indigenousEthnicity||"ខ្មែរ",u.disability||u.disabilityType||"មិនមាន",u.note||""]),ftr=[[""],["","","","","","","","","","ថ្ងៃអង្គារ ១កើត ខែភទ្របទ ឆ្នាំមមី អដ្ឋស័ក ពុទ្ធសករាជ ២៥៧០"],["","","","","","","","","","ធ្វើនៅ ខេត្តស្ទឹងត្រែង ថ្ងៃទី០១ខែកញ្ញាឆ្នាំ២០២៦"],["","","","","","","","","","បានឃើញនិងឯកភាព"],["","","","","","","","","","នាយកសាលា"]],o=[...i,...l,...ftr],c=Gm.aoa_to_sheet(o);c["!cols"]=[{wch:6},{wch:22},{wch:8},{wch:14},{wch:38},{wch:18},{wch:16},{wch:18},{wch:16},{wch:38},{wch:14},{wch:14},{wch:16}];const d=Gm.book_new();Gm.book_append_sheet(d,c,"បញ្ជីសិស្ស-ថ្នាក់6ក"),sre(d,t)}function wtt(r="បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.xlsx"){doe(EXACT_46,r,"សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល","6-ក")}`;

code = code.slice(0, blockStart) + newParserAndIoBlock + code.slice(blockEnd);
console.log("3. Replaced X2..wtt block cleanly.");

// 4. Fix q0 CSV download filename
const oldCsvName = `"moeys_students_list_template.csv"`;
const newCsvName = `"បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.csv"`;
if (!code.includes(oldCsvName)) {
  throw new Error("Could not find oldCsvName");
}
code = code.replace(oldCsvName, newCsvName);
console.log("4. Updated CSV download filename.");

// 5. Fix one-click EXACT_46 button so it also resets modal state and closes modal cleanly
const oldQuickBtn = `onClick:()=>{o(EXACT_46,!0);F("បាននាំចូលបញ្ជីសិស្សផ្លូវការ ៤៦ នាក់ (ស្រី ២៣ នាក់) ថ្នាក់ 6-ក ហ៊ុនសែនអូរឫស្សីកណ្តាល ដោយជោគជ័យ ១០០%!");}`;
const newQuickBtn = `onClick:()=>{o(EXACT_46,!0),ud(""),f([]),fd(""),g({}),Fc(!1),F("បាននាំចូលបញ្ជីសិស្សផ្លូវការ ៤៦ នាក់ (ស្រី ២៣ នាក់) ថ្នាក់ 6-ក ហ៊ុនសែនអូរឫស្សីកណ្តាល ដោយជោគជ័យ ១០០%!")}`;
if (!code.includes(oldQuickBtn)) {
  throw new Error("Could not find oldQuickBtn");
}
code = code.replace(oldQuickBtn, newQuickBtn);
console.log("5. Fixed one-click EXACT_46 button to close modal & reset state.");

// 6. Reset file input value onChange so re-uploading the same file always triggers onChange
const oldFileInput = `onChange:oe=>{var ir;const ft=(ir=oe.target.files)==null?void 0:ir[0];ft&&Xb(ft)}`;
const newFileInput = `onChange:oe=>{var ir;const ft=(ir=oe.target.files)==null?void 0:ir[0];oe.target.value="",ft&&Xb(ft)}`;
if (!code.includes(oldFileInput)) {
  throw new Error("Could not find oldFileInput");
}
code = code.replace(oldFileInput, newFileInput);
console.log("6. Fixed file input value reset onChange.");

// 7. Show all preview rows up to 100 and fix Se.length > 10 mismatch
const oldPreviewSlice = `Se.slice(0,49).map(`;
const newPreviewSlice = `Se.slice(0,100).map(`;
const oldPreviewMore = `Se.length>10&&e.jsxs("div",{className:"p-2 text-center text-slate-500 text-[11px] bg-slate-50 border-t border-slate-100",children:["... និងសិស្សចំនួន ",Se.length-10," នាក់ផ្សេងទៀត"]})`;
const newPreviewMore = `Se.length>100&&e.jsxs("div",{className:"p-2 text-center text-slate-500 text-[11px] bg-slate-50 border-t border-slate-100",children:["... និងសិស្សចំនួន ",Se.length-100," នាក់ផ្សេងទៀត"]})`;
if (!code.includes(oldPreviewSlice) || !code.includes(oldPreviewMore)) {
  throw new Error("Could not find preview slice/more");
}
code = code.replace(oldPreviewSlice, newPreviewSlice).replace(oldPreviewMore, newPreviewMore);
console.log("7. Fixed preview table row limit & count message.");

// 8. Fix missing newline in textarea placeholder
const oldPlaceholder = `សេចក្តីផ្សេងៗ1,កៃ សៃឌី`;
const newPlaceholder = `សេចក្តីផ្សេងៗ\\n1,កៃ សៃឌី`;
if (code.includes(oldPlaceholder)) {
  code = code.replace(oldPlaceholder, newPlaceholder);
  console.log("8. Fixed textarea placeholder newline.");
}

// 9. Fix Xb file extension check, reset stale preview, and show error toast if CSV returns 0 rows
const oldXbBody = `Xb=async oe=>{Vd(!0),fd(oe.name);try{if(/\\.(xlsx|xls)$/i.test(oe.name)){const{students:ir,meta:Or}=await vtt(oe,il?0:n.length);ir.length>0?(f(ir),g(Or),F(\`បានអានឯកសារ Excel: រកឃើញសិស្សចំនួន \${ir.length} នាក់!\`)):F("មិនអាចរកឃើញទិន្នន័យសិស្សក្នុងឯកសារ Excel នេះទេ។")}else{const ir=await oe.text();ud(ir);const{students:Or,meta:Wr}=zw(ir,il?0:n.length);Or.length>0&&(f(Or),g(Wr),F(\`បានអានឯកសារ CSV: រកឃើញសិស្សចំនួន \${Or.length} នាក់!\`))}}catch(ft){console.error("Error reading file:",ft),F("មានបញ្ហាក្នុងការអានឯកសារ សូមពិនិត្យមើលឯកសារឡើងវិញ។")}finally{Vd(!1)}}`;
const newXbBody = `Xb=async oe=>{Vd(!0),fd(oe.name),f([]),g({});try{if(/\\.(xlsx|xls|xlsm|xlsb|ods)$/i.test(oe.name)){const{students:ir,meta:Or}=await vtt(oe,il?0:n.length);ir.length>0?(f(ir),g(Or),F(\`បានអានឯកសារ Excel: រកឃើញសិស្សចំនួន \${ir.length} នាក់!\`)):F("មិនអាចរកឃើញទិន្នន័យសិស្សក្នុងឯកសារ Excel នេះទេ។")}else{const ir=await oe.text();ud(ir);const{students:Or,meta:Wr}=zw(ir,il?0:n.length);Or.length>0?(f(Or),g(Wr),F(\`បានអានឯកសារ CSV: រកឃើញសិស្សចំនួន \${Or.length} នាក់!\`)):F("មិនអាចរកឃើញទិន្នន័យសិស្សក្នុងឯកសារ CSV នេះទេ។")}}catch(ft){console.error("Error reading file:",ft),F("មានបញ្ហាក្នុងការអានឯកសារ សូមពិនិត្យមើលឯកសារឡើងវិញ។")}finally{Vd(!1)}}`;
if (!code.includes(oldXbBody)) {
  throw new Error("Could not find oldXbBody");
}
code = code.replace(oldXbBody, newXbBody);
code = code.replace(`accept:".xlsx,.xls,.csv,.txt,.tsv"`, `accept:".xlsx,.xls,.xlsm,.xlsb,.ods,.csv,.txt,.tsv"`);
console.log("9. Updated Xb and file input accept.");

fs.writeFileSync(bundlePath, code, "utf8");
console.log("Saved patched bundle successfully! New length:", code.length);
