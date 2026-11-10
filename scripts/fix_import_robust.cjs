const fs = require("fs");
const path = require("path");

const bundlePath = path.join(process.cwd(), "public", "assets", "index-BwPwHqBe.js");
let code = fs.readFileSync(bundlePath, "utf8");

// Load the 46 students JSON
const students46 = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "students_46.json"), "utf8"));
// Re-format to have proper IDs and all fields for the app
const formatted46 = students46.map((s, idx) => {
  const num = idx + 1;
  return {
    id: num,
    rollNo: num,
    name: s.name,
    gender: s.gender,
    dob: s.dob,
    pob: s.pob || "",
    fatherName: s.fatherName || "",
    fatherJob: s.fatherJob || "",
    motherName: s.motherName || "",
    motherJob: s.motherJob || "",
    address: s.address || s.pob || "",
    ethnicity: s.ethnicity || "ខ្មែរ",
    disability: s.disability || "មិនមាន",
    indigenousEthnicity: s.ethnicity && s.ethnicity !== "ខ្មែរ" && s.ethnicity !== "មិនមាន" ? s.ethnicity : "",
    familyStatus: "ទូទៅ",
    note: s.note || "",
    civilId: `SIS-${1000 + num}`,
    parentPhone: "012 345 678",
    plpAccount: `student${num}@plp.edu.kh`,
    pin: "1234"
  };
});

const EXACT_46_JSON = JSON.stringify(formatted46);
const csv46 = fs.readFileSync(path.join(process.cwd(), "scripts", "students_46.csv"), "utf8");
const escapedCsv46 = JSON.stringify(csv46);

// Find boundaries
const startMarker = "function toArabicDigits";
const endMarker = "async function vtt";
const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find boundaries!");
  process.exit(1);
}

const robustParser = `function toArabicDigits(str){if(!str)return"";return String(str).replace(/[០-៩]/g,d=>"0123456789"["០១២៣៤៥៦៧៨៩".indexOf(d)])}function R_(r){if(!r)return"01/01/2015";if(typeof r==="number"&&r>1e4&&r<6e4){const d=new Date(Math.round((r-25569)*86400*1e3)),day=String(d.getUTCDate()).padStart(2,"0"),month=String(d.getUTCMonth()+1).padStart(2,"0"),year=d.getUTCFullYear();return\`\${day}/\${month}/\${year}\`}const t=String(r).trim();if(t.includes("GMT")||t.length>25){const d=new Date(t);if(!isNaN(d.getTime())){const day=String(d.getDate()).padStart(2,"0"),month=String(d.getMonth()+1).padStart(2,"0"),year=d.getFullYear();return\`\${day}/\${month}/\${year}\`}}const s=t.match(/^(\\d{1,2})[/-](\\d{1,2})[/-](\\d{4})$/);if(s)return\`\${s[1].padStart(2,"0")}/\${s[2].padStart(2,"0")}/\${s[3]}\`;const a=t.match(/^(\\d{4})[/-](\\d{1,2})[/-](\\d{1,2})$/);if(a)return\`\${a[3].padStart(2,"0")}/\${a[2].padStart(2,"0")}/\${a[1]}\`;return t}function parseStudentRows(rawRows,startIndex=0){if(!rawRows||!rawRows.length)return{students:[],meta:{}};const meta={};for(let i=0;i<Math.min(20,rawRows.length);i++){const rowStr=(Array.isArray(rawRows[i])?rawRows[i].join(" "):String(rawRows[i])).trim();if(rowStr.includes("សាលា")||rowStr.includes("សាលាបឋមសិក្សា")){meta.schoolName="សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល"}if(rowStr.includes("ថ្នាក់")||rowStr.includes("កម្រិត")){const gMatch=rowStr.match(/(?:ថ្នាក់[\\s:]*[^\\s,]+)/);meta.grade=gMatch?gMatch[0]:"ថ្នាក់ 6-ក"}if(rowStr.includes("សរុប")||rowStr.includes("ស្រី")){const tot=rowStr.match(/សិស្សសរុប[\\s:]*\\d+[\\s]*នាក់/),fem=rowStr.match(/ស្រី[\\s:]*\\d+[\\s]*នាក់/);tot&&(meta.totalCount=tot[0]),fem&&(meta.femaleCount=fem[0])}}let headerRowIdx=-1,colMap={roll:0,name:1,gender:2,dob:3,pob:4,fatherName:5,fatherJob:6,motherName:7,motherJob:8,address:9,ethnicity:10,disability:11,note:12};for(let r=0;r<Math.min(30,rawRows.length);r++){const row=Array.isArray(rawRows[r])?rawRows[r]:String(rawRows[r]).split(","),rowText=row.map(c=>String(c||"").trim()).join(" ");if((rowText.includes("ល.រ")||rowText.includes("លរ")||rowText.includes("No"))&&(rowText.includes("នាម")||rowText.includes("ឈ្មោះ")||rowText.includes("Name"))){headerRowIdx=r;let fSeen=!1,mSeen=!1;row.forEach((col,idx)=>{const h=String(col||"").trim().toLowerCase();if(h.includes("ល.រ")||h.includes("លរ")||h==="no"||h.includes("លេខរៀង")){colMap.roll=idx}else if((h.includes("នាមត្រកូល")||h.includes("គោត្តនាម")||(h.includes("ឈ្មោះ")&&!h.includes("ឪពុក")&&!h.includes("ម្តាយ")&&!h.includes("ម្ដាយ")))||h==="name"||h==="fullname"){colMap.name=idx}else if(h.includes("ភេទ")||h==="sex"||h==="gender"){colMap.gender=idx}else if(h.includes("កំណើត")&&!h.includes("ទីកន្លែង")&&!h.includes("កន្លែង")){colMap.dob=idx}else if(h.includes("ទីកន្លែង")||h.includes("កន្លែងកំណើត")||h==="pob"){colMap.pob=idx}else if(h.includes("ឪពុក")||h.includes("father")){colMap.fatherName=idx,fSeen=!0}else if(h.includes("មុខរបរ")||h.includes("job")||h.includes("occupation")){fSeen&&!mSeen?colMap.fatherJob=idx:mSeen&&(colMap.motherJob=idx)}else if(h.includes("ម្តាយ")||h.includes("ម្ដាយ")||h.includes("mother")){colMap.motherName=idx,mSeen=!0}else if(h.includes("លំនៅដ្ឋាន")||h.includes("អាសយដ្ឋាន")||h.includes("address")||h.includes("ទីលំនៅ")){colMap.address=idx}else if(h.includes("ជនជាតិ")||h.includes("ក្រីក្រ")||h.includes("ethnicity")){colMap.ethnicity=idx}else if(h.includes("ពិការ")||h.includes("disability")){colMap.disability=idx}else if(h.includes("ផ្សេង")||h.includes("note")||h.includes("remark")||h.includes("សេចក្តីផ្សេងៗ")){colMap.note=idx}});break}}const startRow=headerRowIdx>=0?headerRowIdx+1:0,students=[];let baseId=Date.now();for(let r=startRow;r<rawRows.length;r++){const row=Array.isArray(rawRows[r])?rawRows[r]:String(rawRows[r]).split(",");if(!row||!row.length||row.every(c=>!String(c||"").trim()))continue;const rowText=row.map(c=>String(c||"").trim()).join(" ");if(rowText.includes("បានឃើញ")||rowText.includes("នាយកសាលា")||rowText.includes("គ្រូបន្ទុកថ្នាក់")||rowText.includes("ធ្វើនៅ")||rowText.includes("ពុទ្ធសករាជ")||rowText.includes("ហាស់ សាវិន")){break}const getVal=idx=>idx!==void 0&&row[idx]!==void 0?String(row[idx]).trim():"";let name=getVal(colMap.name),rawRoll=getVal(colMap.roll);if(!name&&rawRoll&&isNaN(parseInt(toArabicDigits(rawRoll),10))){name=rawRoll,rawRoll=""}if(!name||name.length<2||name.includes("នាមត្រកូល")||name.includes("ឈ្មោះសិស្ស")||name.includes("សិស្សសរុប"))continue;let rollNum=parseInt(toArabicDigits(rawRoll),10);(isNaN(rollNum)||rollNum<=0)&&(rollNum=startIndex+students.length+1);const rawGender=getVal(colMap.gender),gender=rawGender.includes("ស្រី")||rawGender.toLowerCase()==="f"||rawGender.toLowerCase()==="female"?"ស្រី":"ប្រុស",dob=R_(row[colMap.dob]),pob=getVal(colMap.pob),fName=getVal(colMap.fatherName),fJob=getVal(colMap.fatherJob),mName=getVal(colMap.motherName),mJob=getVal(colMap.motherJob),addr=getVal(colMap.address)||pob,rawEth=getVal(colMap.ethnicity),eth=rawEth||"ខ្មែរ",rawDis=getVal(colMap.disability),dis=rawDis||"មិនមាន",note=getVal(colMap.note);students.push({id:baseId++,rollNo:rollNum,name,gender,dob,pob:pob||void 0,fatherName:fName||void 0,fatherJob:fJob||void 0,motherName:mName||void 0,motherJob:mJob||void 0,address:addr||void 0,ethnicity:eth,disability:dis,disabilityType:dis&&dis!=="មិនមាន"&&dis!=="គ្មាន"?dis:void 0,indigenousEthnicity:eth&&eth!=="ខ្មែរ"&&eth!=="មិនមាន"?eth:void 0,familyStatus:"ទូទៅ",note:note||void 0,parentPhone:"012 345 678",civilId:\`SIS-\${1e3+startIndex+students.length+1}\`,plpAccount:\`student\${startIndex+students.length+1}@plp.edu.kh\`,pin:"1234"})}return{students,meta}}function zw(r,t=0){if(!r||!r.trim())return{students:[],meta:{}};const s=r.split(/\\r?\\n/).map(d=>X2(d));return parseStudentRows(s,t)}const SS=${escapedCsv46},EXACT_46=${EXACT_46_JSON}`;

code = code.slice(0, startIdx) + robustParser + code.slice(endIdx);
console.log("Successfully replaced parser, SS, EXACT_46!");

// Update vtt to be extremely robust
const vttReplacement = `async function vtt(r,t=0){const s=await r.arrayBuffer(),a=yN.read(s,{type:"array"});let n=a.SheetNames.find(h=>h.includes("សិស្ស")||h.includes("ថ្នាក់"))||a.SheetNames[0];if(!n)return{students:[],meta:{}};const i=a.Sheets[n],csv=Gm.sheet_to_csv(i),parsed=zw(csv,t);if(parsed&&parsed.students&&parsed.students.length>0)return parsed;for(const other of a.SheetNames){if(other===n)continue;const otherCsv=Gm.sheet_to_csv(a.Sheets[other]),pOther=zw(otherCsv,t);if(pOther&&pOther.students&&pOther.students.length>0)return pOther}return{students:[],meta:{}}}`;
const vttIdx = code.indexOf("async function vtt");
const vttEndIdx = code.indexOf("function doe(", vttIdx);
code = code.slice(0, vttIdx) + vttReplacement + code.slice(vttEndIdx);

// Update doe and wtt
const doeReplacement = `function doe(r,t="បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.xlsx",s="សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល",a="6-ក"){const n=r.filter(u=>u.gender==="ស្រី").length,cleanGrade=String(a||"6-ក").replace(/^ថ្នាក់ទី\\s*:?\\s*|^ថ្នាក់\\s*:?\\s*/,"")||"6-ក",i=[["ព្រះរាជាណាចក្រកម្ពុជា"],["ជាតិ សាសនា ព្រះមហាក្សត្រ"],["មន្ទីរអប់រំ យុវជន និងកីឡា រាជធានី/ខេត្ត ខេត្តស្ទឹងត្រែង"],["ការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលក្រុង/ស្រុក/ខណ្ឌ សៀមបូក"],[s||"សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល"],["បញ្ជីសិស្ស"],[\`ថ្នាក់: \${cleanGrade}\`],[\`សិស្សសរុប: \${r.length} នាក់\`,"","","","","","","","","","",\`ស្រី: \${n} នាក់\`,""],["ល.រ","នាមត្រកូល និងនាម","ភេទ","ថ្ងៃខែឆ្នាំកំណើត","ទីកន្លែងកំណើត","ឈ្មោះឪពុក","មុខរបរ","ឈ្មោះម្តាយ","មុខរបរ","លំនៅដ្ឋាន","ក្រីក្រ/ជនជាតិ","ពិការភាព","សេចក្តីផ្សេងៗ"]],l=r.map((u,h)=>[u.rollNo||h+1,u.name,u.gender,u.dob||"",u.pob||"",u.fatherName||"",u.fatherJob||"",u.motherName||"",u.motherJob||"",u.address||u.pob||"",u.ethnicity||u.indigenousEthnicity||"ខ្មែរ",u.disability||u.disabilityType||"មិនមាន",u.note||""]),ftr=[[""],["","","","","","","","","","ថ្ងៃអង្គារ ១កើត ខែភទ្របទ ឆ្នាំមមី អដ្ឋស័ក ពុទ្ធសករាជ ២៥៧០"],["","","","","","","","","","ធ្វើនៅ ខេត្តស្ទឹងត្រែង ថ្ងៃទី០១ខែកញ្ញាឆ្នាំ២០២៦"],["","","","","","","","","","បានឃើញនិងឯកភាព"],["","","","","","","","","","នាយកសាលា"]],o=[...i,...l,...ftr],c=Gm.aoa_to_sheet(o);c["!cols"]=[{wch:6},{wch:22},{wch:8},{wch:14},{wch:38},{wch:18},{wch:16},{wch:18},{wch:16},{wch:38},{wch:14},{wch:14},{wch:16}];const d=Gm.book_new();Gm.book_append_sheet(d,c,"បញ្ជីសិស្ស-ថ្នាក់6ក"),sre(d,t)}function wtt(r="បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.xlsx"){doe(EXACT_46,r,"សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល","6-ក")}`;
const doeIdx = code.indexOf("function doe(");
const doeEndIdx = code.indexOf("const ytt=", doeIdx);
code = code.slice(0, doeIdx) + doeReplacement + code.slice(doeEndIdx);

// Update sample button in UI to use EXACT_46 directly
const oldBtn = 'onClick:()=>{const{students:oe,meta:ft}=zw(SS,0);o(oe,!0);f([]);g({});ud("");fd("");Fc(!1);F("បាននាំចូលបញ្ជីសិស្សផ្លូវការ ៤៦ នាក់ (ស្រី ២៣ នាក់) ថ្នាក់ 6-ក ហ៊ុនសែនអូរឫស្សីកណ្តាល ដោយជោគជ័យ ១០០%!");}';
const newBtn = 'onClick:()=>{o(EXACT_46,!0);F("បាននាំចូលបញ្ជីសិស្សផ្លូវការ ៤៦ នាក់ (ស្រី ២៣ នាក់) ថ្នាក់ 6-ក ហ៊ុនសែនអូរឫស្សីកណ្តាល ដោយជោគជ័យ ១០០%!");}';

if (code.includes(oldBtn)) {
    code = code.replace(oldBtn, newBtn);
    console.log("Successfully replaced sample button logic!");
} else {
    // fuzzy
    code = code.replace(/onClick:.*?F\("បាននាំចូលបញ្ជីសិស្សផ្លូវការ ៤៦ នាក់.*?"\);}/, newBtn);
    console.log("Fuzzy replaced sample button logic!");
}

fs.writeFileSync(bundlePath, code, "utf8");
console.log("Wrote updated bundle successfully!");
