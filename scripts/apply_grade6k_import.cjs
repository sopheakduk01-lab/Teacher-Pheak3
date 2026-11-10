const fs = require("fs");
const path = require("path");

const bundlePath = path.join(process.cwd(), "public", "assets", "index-BwPwHqBe.js");
let code = fs.readFileSync(bundlePath, "utf8");

// Load the 46 students CSV generated earlier
const csv46 = fs.readFileSync(path.join(process.cwd(), "scripts", "students_46.csv"), "utf8");
const escapedCsv46 = JSON.stringify(csv46);

// 1. Locate the section between "function R_(" and "const ytt=({teacher"
const startMarker = "function R_(";
const endMarker = "const ytt=({teacher";

const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find boundaries for R_ and ytt!");
  process.exit(1);
}

// Construct the new robust parsing code:
const newCodeBlock = `function toArabicDigits(str){if(!str)return"";return String(str).replace(/[០-៩]/g,d=>"0123456789"["០១២៣៤៥៦៧៨៩".indexOf(d)])}function R_(r){if(!r)return"01/01/2015";if(typeof r==="number"&&r>1e4&&r<6e4){const d=new Date(Math.round((r-25569)*86400*1e3)),day=String(d.getUTCDate()).padStart(2,"0"),month=String(d.getUTCMonth()+1).padStart(2,"0"),year=d.getUTCFullYear();return\`\${day}/\${month}/\${year}\`}const t=String(r).trim(),s=t.match(/^(\\d{1,2})[/-](\\d{1,2})[/-](\\d{4})$/);if(s){const n=s[1].padStart(2,"0"),i=s[2].padStart(2,"0");return\`\${n}/\${i}/\${s[3]}\`}const a=t.match(/^(\\d{4})[/-](\\d{1,2})[/-](\\d{1,2})$/);if(a){const n=a[1],i=a[2].padStart(2,"0"),l=a[3].padStart(2,"0");return\`\${l}/\${i}/\${n}\`}return t}function parseStudentRows(rawRows,startIndex=0){if(!rawRows||!rawRows.length)return{students:[],meta:{}};const meta={};for(let i=0;i<Math.min(15,rawRows.length);i++){const rowStr=(Array.isArray(rawRows[i])?rawRows[i].join(" "):String(rawRows[i])).trim();if(rowStr.includes("សាលា")||rowStr.includes("សាលាបឋមសិក្សា")){meta.schoolName="សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល"}if(rowStr.includes("ថ្នាក់")||rowStr.includes("កម្រិត")){const gMatch=rowStr.match(/(?:ថ្នាក់[\\s:]*[^\\s,]+)/);meta.grade=gMatch?gMatch[0]:"ថ្នាក់ 6-ក"}if(rowStr.includes("សរុប")||rowStr.includes("ស្រី")){const tot=rowStr.match(/សិស្សសរុប[\\s:]*\\d+[\\s]*នាក់/),fem=rowStr.match(/ស្រី[\\s:]*\\d+[\\s]*នាក់/);tot&&(meta.totalCount=tot[0]),fem&&(meta.femaleCount=fem[0])}}let headerRowIdx=-1,colMap={roll:0,name:1,gender:2,dob:3,pob:4,fatherName:5,fatherJob:6,motherName:7,motherJob:8,address:9,ethnicity:10,disability:11,note:12};for(let r=0;r<Math.min(25,rawRows.length);r++){const row=Array.isArray(rawRows[r])?rawRows[r]:String(rawRows[r]).split(","),rowText=row.map(c=>String(c||"").trim()).join(" ");if((rowText.includes("ល.រ")||rowText.includes("លរ")||rowText.includes("No"))&&(rowText.includes("នាម")||rowText.includes("ឈ្មោះ")||rowText.includes("Name"))){headerRowIdx=r;let fatherSeen=!1,motherSeen=!1;row.forEach((col,idx)=>{const h=String(col||"").trim().toLowerCase();if(h.includes("ល.រ")||h.includes("លរ")||h==="no"||h.includes("លេខរៀង")){colMap.roll=idx}else if((h.includes("នាមត្រកូល")||h.includes("គោត្តនាម")||(h.includes("ឈ្មោះ")&&!h.includes("ឪពុក")&&!h.includes("ម្តាយ")&&!h.includes("ម្ដាយ")))||h==="name"||h==="fullname"){colMap.name=idx}else if(h.includes("ភេទ")||h==="sex"||h==="gender"){colMap.gender=idx}else if(h.includes("កំណើត")&&!h.includes("ទីកន្លែង")&&!h.includes("កន្លែង")){colMap.dob=idx}else if(h.includes("ទីកន្លែង")||h.includes("កន្លែងកំណើត")||h==="pob"){colMap.pob=idx}else if(h.includes("ឪពុក")||h.includes("father")){colMap.fatherName=idx,fatherSeen=!0}else if(h.includes("មុខរបរ")||h.includes("job")||h.includes("occupation")){fatherSeen&&!motherSeen?colMap.fatherJob=idx:motherSeen&&(colMap.motherJob=idx)}else if(h.includes("ម្តាយ")||h.includes("ម្ដាយ")||h.includes("mother")){colMap.motherName=idx,motherSeen=!0}else if(h.includes("លំនៅដ្ឋាន")||h.includes("អាសយដ្ឋាន")||h.includes("address")||h.includes("ទីលំនៅ")){colMap.address=idx}else if(h.includes("ជនជាតិ")||h.includes("ក្រីក្រ")||h.includes("ethnicity")){colMap.ethnicity=idx}else if(h.includes("ពិការ")||h.includes("disability")){colMap.disability=idx}else if(h.includes("ផ្សេង")||h.includes("note")||h.includes("remark")||h.includes("សេចក្តីផ្សេងៗ")){colMap.note=idx}});break}}const startRow=headerRowIdx>=0?headerRowIdx+1:0,students=[];let baseId=Date.now();for(let r=startRow;r<rawRows.length;r++){const row=Array.isArray(rawRows[r])?rawRows[r]:String(rawRows[r]).split(",");if(!row||!row.length||row.every(c=>!String(c||"").trim()))continue;const rowText=row.map(c=>String(c||"").trim()).join(" ");if(rowText.includes("បានឃើញ និងឯកភាព")||rowText.includes("បានឃើញនិងឯកភាព")||rowText.includes("នាយកសាលា")||rowText.includes("គ្រូបន្ទុកថ្នាក់")||rowText.includes("ថ្ងៃចន្ទ")||rowText.includes("ថ្ងៃអង្គារ")||rowText.includes("ធ្វើនៅ")||rowText.includes("ពុទ្ធសករាជ")||rowText.includes("ហាស់ សាវិន")||rowText.includes("ហត្ថលេខា")){break}const getVal=idx=>idx!==void 0&&row[idx]!==void 0?String(row[idx]).trim():"";let rawRoll=getVal(colMap.roll),name=getVal(colMap.name);if(!name&&rawRoll&&isNaN(parseInt(toArabicDigits(rawRoll),10))){name=rawRoll,rawRoll=""}if(!name||name.length<2||name.includes("នាមត្រកូល")||name.includes("ឈ្មោះសិស្ស")||name.includes("សិស្សសរុប"))continue;let rollNum=parseInt(toArabicDigits(rawRoll),10);(isNaN(rollNum)||rollNum<=0)&&(rollNum=startIndex+students.length+1);const rawGender=getVal(colMap.gender),gender=rawGender.includes("ស្រី")||rawGender.toLowerCase()==="f"||rawGender.toLowerCase()==="female"?"ស្រី":"ប្រុស",dob=R_(row[colMap.dob]),pob=getVal(colMap.pob),fatherName=getVal(colMap.fatherName),fatherJob=getVal(colMap.fatherJob),motherName=getVal(colMap.motherName),motherJob=getVal(colMap.motherJob),address=getVal(colMap.address)||pob,rawEthnicity=getVal(colMap.ethnicity),ethnicity=rawEthnicity||"ខ្មែរ",rawDisability=getVal(colMap.disability),disability=rawDisability||"មិនមាន",note=getVal(colMap.note),civilId=\`SIS-\${1e3+startIndex+students.length+1}\`,plpAccount=\`student\${startIndex+students.length+1}@plp.edu.kh\`,parentPhone="012 345 678";students.push({id:baseId++,rollNo:rollNum,name,gender,dob,pob:pob||void 0,fatherName:fatherName||void 0,fatherJob:fatherJob||void 0,motherName:motherName||void 0,motherJob:motherJob||void 0,address:address||void 0,ethnicity,disability,disabilityType:disability&&disability!=="មិនមាន"&&disability!=="គ្មាន"?disability:void 0,indigenousEthnicity:ethnicity&&ethnicity!=="ខ្មែរ"&&ethnicity!=="មិនមាន"?ethnicity:void 0,familyStatus:"ទូទៅ",note:note||void 0,parentPhone,civilId,plpAccount})}return{students,meta}}function zw(r,t=0){if(!r||!r.trim())return{students:[],meta:{}};const s=r.split(/\\r?\\n/).map(d=>X2(d));return parseStudentRows(s,t)}const SS=${escapedCsv46};async function vtt(r,t=0){const s=await r.arrayBuffer(),a=EA(s,{type:"array",cellDates:!0});let n=a.SheetNames.find(h=>h.includes("សិស្ស")||h.includes("ថ្នាក់"))||a.SheetNames[0];if(!n)return{students:[],meta:{}};const i=a.Sheets[n],rows=Gm.sheet_to_json(i,{header:1,raw:!1,defval:""}),parsed=parseStudentRows(rows,t);if(parsed&&parsed.students&&parsed.students.length>0)return parsed;for(const otherName of a.SheetNames){if(otherName===n)continue;const otherRows=Gm.sheet_to_json(a.Sheets[otherName],{header:1,raw:!1,defval:""}),pOther=parseStudentRows(otherRows,t);if(pOther&&pOther.students&&pOther.students.length>0)return pOther}const l=Gm.sheet_to_csv(i);return zw(l,t)}function doe(r,t="បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.xlsx",s="សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល",a="6-ក"){const n=r.filter(u=>u.gender==="ស្រី").length,cleanGrade=String(a||"6-ក").replace(/^ថ្នាក់ទី\\s*:?\\s*|^ថ្នាក់\\s*:?\\s*/,"")||"6-ក",i=[["ព្រះរាជាណាចក្រកម្ពុជា"],["ជាតិ សាសនា ព្រះមហាក្សត្រ"],["មន្ទីរអប់រំ យុវជន និងកីឡា រាជធានី/ខេត្ត ខេត្តស្ទឹងត្រែង"],["ការិយាល័យអប់រំ យុវជន និងកីឡារដ្ឋបាលក្រុង/ស្រុក/ខណ្ឌ សៀមបូក"],[s||"សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល"],["បញ្ជីសិស្ស"],[\`ថ្នាក់: \${cleanGrade}\`],[\`សិស្សសរុប: \${r.length} នាក់\`,"","","","","","","","","","",\`ស្រី: \${n} នាក់\`,""],["ល.រ","នាមត្រកូល និងនាម","ភេទ","ថ្ងៃខែឆ្នាំកំណើត","ទីកន្លែងកំណើត","ឈ្មោះឪពុក","មុខរបរ","ឈ្មោះម្តាយ","មុខរបរ","លំនៅដ្ឋាន","ក្រីក្រ/ជនជាតិ","ពិការភាព","សេចក្តីផ្សេងៗ"]],l=r.map((u,h)=>[u.rollNo||h+1,u.name,u.gender,u.dob||"",u.pob||"",u.fatherName||"",u.fatherJob||"",u.motherName||"",u.motherJob||"",u.address||u.pob||"",u.ethnicity||u.indigenousEthnicity||"ខ្មែរ",u.disability||u.disabilityType||"មិនមាន",u.note&&u.note!=="នៅរស់"?u.note:""]),ftr=[[""],["","","","","","","","","","ថ្ងៃអង្គារ ១កើត ខែភទ្របទ ឆ្នាំមមី អដ្ឋស័ក ពុទ្ធសករាជ ២៥៧០"],["","","","","","","","","","ធ្វើនៅ ខេត្តស្ទឹងត្រែង ថ្ងៃទី០១ខែកញ្ញាឆ្នាំ២០២៦"],["","","","","","","","","","បានឃើញនិងឯកភាព"],["","","","","","","","","","នាយកសាលា"]],o=[...i,...l,...ftr],c=Gm.aoa_to_sheet(o);c["!cols"]=[{wch:6},{wch:22},{wch:8},{wch:14},{wch:38},{wch:18},{wch:16},{wch:18},{wch:16},{wch:38},{wch:14},{wch:14},{wch:16}];const d=Gm.book_new();Gm.book_append_sheet(d,c,"បញ្ជីសិស្ស-ថ្នាក់6ក"),sre(d,t)}function wtt(r="បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.xlsx"){const{students:t}=zw(SS,0);doe(t,r,"សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល","6-ក")}`;

code = code.slice(0, startIdx) + newCodeBlock + code.slice(endIdx);
console.log("Successfully replaced parser, SS, vtt, doe, wtt!");

// 2. Replace file extension check in Xb:
// From: if(oe.name.endsWith(".xlsx")||oe.name.endsWith(".xls"))
// To: if(/\.(xlsx|xls)$/i.test(oe.name))
code = code.replace(
  'if(oe.name.endsWith(".xlsx")||oe.name.endsWith(".xls"))',
  'if(/\\.(xlsx|xls)$/i.test(oe.name))'
);

// 3. Update W0 and q0:
code = code.replace(
  'wtt("moeys_students_grade6A_template.xlsx")',
  'wtt("បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.xlsx")'
);

code = code.replace(
  'download,"moeys_students_list_template.csv"',
  'download,"បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.csv"'
);

// 4. Update the sample button in the UI:
const oldBtn = 'onClick:()=>{const{students:oe,meta:ft}=zw(SS,0);f(oe),g(ft),Bp(!0),fd("បញ្ជីសិស្ស_ថ្នាក់6-ក_៤៩នាក់.xlsx"),ud(""),F("បានផ្ទុកទិន្នន័យគំរូសិស្ស ៤៩ នាក់ (ស្រី ២៥ នាក់) ថ្នាក់ 6-ក រួចរាល់!")},className:"bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-xs flex items-center gap-1 transition active:scale-95",children:"⚡ ផ្ទុកគំរូ ៤៩ នាក់ (ថ្នាក់ 6-ក)"}';
const newBtn = 'onClick:()=>{const{students:oe,meta:ft}=zw(SS,0);f(oe),g(ft),Bp(!0),fd("បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.xlsx"),ud(""),F("បានផ្ទុកទិន្នន័យគំរូសិស្ស ៤៦ នាក់ (ស្រី ២៣ នាក់) ថ្នាក់ 6-ក ហ៊ុនសែនអូរឫស្សីកណ្តាល រួចរាល់!")},className:"bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-xs flex items-center gap-1 transition active:scale-95",children:"⚡ ផ្ទុកគំរូ ៤៦ នាក់ (ថ្នាក់ 6-ក ហ៊ុនសែនអូរឫស្សីកណ្តាល)"}';

if (code.includes(oldBtn)) {
  code = code.replace(oldBtn, newBtn);
  console.log("Successfully replaced sample button!");
} else {
  console.log("Old sample button pattern not exact match, searching fuzzy...");
  const p1 = 'fd("បញ្ជីសិស្ស_ថ្នាក់6-ក_៤៩នាក់.xlsx")';
  const p2 = 'children:"⚡ ផ្ទុកគំរូ ៤៩ នាក់ (ថ្នាក់ 6-ក)"';
  code = code.replace(p1, 'fd("បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.xlsx")');
  code = code.replace('បានផ្ទុកទិន្នន័យគំរូសិស្ស ៤៩ នាក់ (ស្រី ២៥ នាក់) ថ្នាក់ 6-ក រួចរាល់!', 'បានផ្ទុកទិន្នន័យគំរូសិស្ស ៤៦ នាក់ (ស្រី ២៣ នាក់) ថ្នាក់ 6-ក ហ៊ុនសែនអូរឫស្សីកណ្តាល រួចរាល់!');
  code = code.replace(p2, 'children:"⚡ ផ្ទុកគំរូ ៤៦ នាក់ (ថ្នាក់ 6-ក ហ៊ុនសែនអូរឫស្សីកណ្តាល)"');
  console.log("Fuzzy replacements applied!");
}

// 5. Update any remaining occurrences of "បញ្ជីសិស្ស_ថ្នាក់6-ក_៤៩នាក់.xlsx"
code = code.replaceAll("បញ្ជីសិស្ស_ថ្នាក់6-ក_៤៩នាក់.xlsx", "បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.xlsx");

fs.writeFileSync(bundlePath, code, "utf8");
console.log("Wrote updated bundle successfully!");
