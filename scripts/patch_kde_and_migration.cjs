const fs = require("fs");
const path = require("path");

const bundlePath = path.join(process.cwd(), "public", "assets", "index-BwPwHqBe.js");
let code = fs.readFileSync(bundlePath, "utf8");

// Load 46 students for kde
const kde46 = JSON.parse(fs.readFileSync(path.join(__dirname, "kde_46.json"), "utf8"));
const kde46Str = "kde=" + JSON.stringify(kde46);

// 1. Replace kde definition
const kdeStart = code.indexOf("kde=[{");
const kdeEnd = code.indexOf(",Bde=", kdeStart);

if (kdeStart === -1 || kdeEnd === -1) {
  console.error("Could not find kde boundaries!");
  process.exit(1);
}

code = code.slice(0, kdeStart) + kde46Str + code.slice(kdeEnd);
console.log("Successfully replaced kde with 46 students!");

// 2. Update Zl migration:
// Find the migration in Zl
const oldMigStr = 'try{if(typeof localStorage<"u"&&!localStorage.getItem("migrated_moeys_49_students_6k_v2")){if(!Array.isArray(st)||st.length===0||st.length===6&&st[0]&&st[0].name==="សុខ ចាន់ថន"||st.length===39&&st[0]&&st[0].name==="នួន ស្រីរ័ត្ន"){st=kde;Gr(r,"students",kde);localStorage.setItem("primary_teacher_admin_v2_students",JSON.stringify(kde))}if(!a.school||a.school==="សាលាបឋមសិក្សា ហ៊ុន សែន"||a.grade==="ថ្នាក់ទី ៤A"){a.school="សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល";a.grade="6-ក";Gr(r,"teacher",a);localStorage.setItem("primary_teacher_admin_v2_teacher",JSON.stringify(a))}localStorage.setItem("migrated_moeys_49_students_6k_v2","1")}}catch{}';

const newMigStr = 'try{if(typeof localStorage<"u"){const migKey="migrated_moeys_46_students_6k_v100";const isOldData=!Array.isArray(st)||st.length===0||st.length===49||st.length===39||st.length===6||(st[0]&&st[0].name==="កទៀត រ៉មី")||(st[0]&&st[0].name==="សុខ ចាន់ថន")||(st[0]&&st[0].name==="នួន ស្រីរ័ត្ន")||!localStorage.getItem(migKey);if(isOldData){st=kde;Gr(r,"students",kde);try{localStorage.setItem("primary_teacher_admin_v2_students",JSON.stringify(kde));localStorage.setItem(migKey,"1");}catch{}}if(!a.school||a.school==="សាលាបឋមសិក្សា ហ៊ុន សែន"||a.grade==="ថ្នាក់ទី ៤A"||!a.school.includes("ហ៊ុនសែនអូរឫស្សីកណ្តាល")){a.school="សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល";a.grade="6-ក";Gr(r,"teacher",a);try{localStorage.setItem("primary_teacher_admin_v2_teacher",JSON.stringify(a));}catch{}}}}catch{}';

if (code.includes(oldMigStr)) {
  code = code.replace(oldMigStr, newMigStr);
  console.log("Successfully replaced Zl migration!");
} else {
  console.log("Old Zl migration not found exactly, searching substring...");
  const pStart = code.indexOf('let st=$r(r,"students",r===am?kde:[]);');
  const pEnd = code.indexOf('return st})()', pStart);
  if (pStart !== -1 && pEnd !== -1) {
    const fullBlock = code.slice(pStart, pEnd);
    console.log("Found block:\n", fullBlock);
    const replacement = `let st=$r(r,"students",r===am?kde:[]);${newMigStr};`;
    code = code.slice(0, pStart) + replacement + code.slice(pEnd);
    console.log("Replaced Zl block via search!");
  }
}

// 3. Set default import mode to true (Replace all) instead of false (Append):
// [il,Bp]=y.useState(!1) -> [il,Bp]=y.useState(!0)
code = code.replace('[il,Bp]=y.useState(!1)', '[il,Bp]=y.useState(!0)');
console.log("Updated default import mode to Replace all!");

// 4. Update the sample button to immediately import the 46 students:
const oldSampleBtn = 'onClick:()=>{const{students:oe,meta:ft}=zw(SS,0);f(oe),g(ft),Bp(!0),fd("បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.xlsx"),ud(""),F("បានផ្ទុកទិន្នន័យគំរូសិស្ស ៤៦ នាក់ (ស្រី ២៣ នាក់) ថ្នាក់ 6-ក ហ៊ុនសែនអូរឫស្សីកណ្តាល រួចរាល់!")}';
const newSampleBtn = 'onClick:()=>{const{students:oe,meta:ft}=zw(SS,0);o(oe,!0);f([]);g({});ud("");fd("");Fc(!1);F("បាននាំចូលបញ្ជីសិស្សផ្លូវការ ៤៦ នាក់ (ស្រី ២៣ នាក់) ថ្នាក់ 6-ក ហ៊ុនសែនអូរឫស្សីកណ្តាល ដោយជោគជ័យ ១០០%!");}';

if (code.includes(oldSampleBtn)) {
  code = code.replace(oldSampleBtn, newSampleBtn);
  console.log("Successfully updated sample button to directly commit import!");
} else {
  console.log("oldSampleBtn not matched exactly");
}

// 5. Update textarea placeholder:
const oldPlaceholder = '1,កទៀត រ៉មី,ប្រុស,13/07/2013,"ពាមក្នុង, ពាមជីលាំង, ត្បូងឃ្មុំ, ខេត្តត្បូងឃ្មុំ",សឺ កទៀត,កសិករ,សា លីហាស់,កសិករ,"ភ្នំខៀវ, អូរកណ្តៀរសែនជ័យ, អូរគ្រៀងសែនជ័យ, ខេត្តក្រចេះ",ចាម,មិនមាន,';
const newPlaceholder = '1,កៃ សៃឌី,ប្រុស,03/02/2015,"ភ្នំខៀវ, អូរកណ្តៀរសែនជ័យ, អូរគ្រៀងសែនជ័យ, ខេត្តក្រចេះ",ភេទ កៃ,,,,"ភ្នំខៀវ, អូរកណ្តៀរសែនជ័យ, អូរគ្រៀងសែនជ័យ, ខេត្តក្រចេះ",ខ្មែរ,មិនមាន,';

if (code.includes(oldPlaceholder)) {
  code = code.replace(oldPlaceholder, newPlaceholder);
  console.log("Successfully updated textarea placeholder!");
}

fs.writeFileSync(bundlePath, code, "utf8");
console.log("Finished patching bundle!");
