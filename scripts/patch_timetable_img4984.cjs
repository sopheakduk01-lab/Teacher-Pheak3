const fs = require("fs");
const ts = require("typescript");

const filePath = "public/assets/index-BwPwHqBe.js";
let code = fs.readFileSync(filePath, "utf8");

// Exact rows from IMG_4984 (and official MoEYS Grade 4-6 timetable)
const newRowsJson = JSON.stringify([
  {time:"6:55-7:10",duration:"១៥នាទី",mon:"គោរពទង់ជាតិ",tue:"គោរពទង់ជាតិ",wed:"គោរពទង់ជាតិ",thu:"គោរពទង់ជាតិ",fri:"គោរពទង់ជាតិ",sat:"គោរពទង់ជាតិ",type:"flag"},
  {time:"7:10-7:50",duration:"៤០នាទី",mon:"ភាសាខ្មែរ",tue:"ភាសាខ្មែរ",wed:"ភាសាខ្មែរ",thu:"បំប៉នភាសាខ្មែរ",fri:"ភាសាខ្មែរ",sat:"អប់រំកាយ និងកីឡា",type:"normal"},
  {time:"7:50-8:30",duration:"៤០នាទី",mon:"ភាសាខ្មែរ",tue:"ភាសាខ្មែរ",wed:"ភាសាខ្មែរ",thu:"បំប៉នភាសាខ្មែរ",fri:"ភាសាខ្មែរ",sat:"អប់រំសុខភាព",type:"normal"},
  {time:"8:30-8:45",duration:"១៥នាទី",mon:"ចេញលេង",tue:"ចេញលេង",wed:"ចេញលេង",thu:"ចេញលេង",fri:"ចេញលេង",sat:"ចេញលេង",type:"break"},
  {time:"8:45-9:25",duration:"៤០នាទី",mon:"គណិតវិទ្យា",tue:"គណិតវិទ្យា",wed:"សិក្សាសង្គម",thu:"បំប៉នគណិតវិទ្យា",fri:"គណិតវិទ្យា",sat:"គណិតវិទ្យា",type:"normal"},
  {time:"9:25-9:40",duration:"១៥នាទី",mon:"ចេញលេង",tue:"ចេញលេង",wed:"ចេញលេង",thu:"ចេញលេង",fri:"ចេញលេង",sat:"ចេញលេង",type:"break"},
  {time:"9:40-10:20",duration:"៤០នាទី",mon:"សិក្សាសង្គម",tue:"វិទ្យាសាស្ត្រ",wed:"គណិតវិទ្យា",thu:"ភាសាអង់គ្លេស",fri:"វិទ្យាសាស្ត្រ",sat:"សិក្សាសង្គម",type:"normal"},
  {time:"10:20-11:00",duration:"៤០នាទី",mon:"សិក្សាសង្គម",tue:"វិទ្យាសាស្ត្រ",wed:"គណិតវិទ្យa",thu:"បំណិនជីវិត",fri:"វិទ្យាសាស្ត្រ",sat:"សិក្សាសង្គម",type:"normal"}
]);

// Wait, fix typo in គណិតវិទ្យa -> គណិតវិទ្យា
const fixedRowsJson = newRowsJson.replace("គណិតវិទ្យa", "គណិតវិទ្យា");

// Replace f$=[...]
const fStart = code.indexOf("f$=[");
if (fStart < 0) throw new Error("Could not find f$=[");
let bracketCount = 0;
let fEnd = -1;
let inStr = false;
let esc = false;
for (let i = fStart; i < code.length; i++) {
  const ch = code[i];
  if (esc) { esc = false; continue; }
  if (ch === "\\\\") { esc = true; continue; }
  if (ch === '"') { inStr = !inStr; continue; }
  if (!inStr) {
    if (ch === "[") bracketCount++;
    else if (ch === "]") {
      bracketCount--;
      if (bracketCount === 0) {
        fEnd = i + 1;
        break;
      }
    }
  }
}
if (fEnd < 0) throw new Error("Could not find end of f$ array");

code = code.slice(0, fStart) + "f$=" + fixedRowsJson + code.slice(fEnd);
console.log("Successfully replaced f$");

// Replace h$=[...] (after f$)
const hStart = code.indexOf("h$=[");
if (hStart < 0) throw new Error("Could not find h$=[");
bracketCount = 0;
let hEnd = -1;
inStr = false;
esc = false;
for (let i = hStart; i < code.length; i++) {
  const ch = code[i];
  if (esc) { esc = false; continue; }
  if (ch === "\\\\") { esc = true; continue; }
  if (ch === '"') { inStr = !inStr; continue; }
  if (!inStr) {
    if (ch === "[") bracketCount++;
    else if (ch === "]") {
      bracketCount--;
      if (bracketCount === 0) {
        hEnd = i + 1;
        break;
      }
    }
  }
}
if (hEnd < 0) throw new Error("Could not find end of h$ array");

code = code.slice(0, hStart) + "h$=" + fixedRowsJson + code.slice(hEnd);
console.log("Successfully replaced h$");

// Replace rows inside Mz object: rows:[...]
const mzRowsIdx = code.indexOf("rows:[");
if (mzRowsIdx < 0) throw new Error("Could not find rows:[ in Mz");
bracketCount = 0;
let mzRowsEnd = -1;
inStr = false;
esc = false;
const rStart = code.indexOf("[", mzRowsIdx);
for (let i = rStart; i < code.length; i++) {
  const ch = code[i];
  if (esc) { esc = false; continue; }
  if (ch === "\\\\") { esc = true; continue; }
  if (ch === '"') { inStr = !inStr; continue; }
  if (!inStr) {
    if (ch === "[") bracketCount++;
    else if (ch === "]") {
      bracketCount--;
      if (bracketCount === 0) {
        mzRowsEnd = i + 1;
        break;
      }
    }
  }
}
if (mzRowsEnd < 0) throw new Error("Could not find end of Mz rows array");

code = code.slice(0, rStart) + fixedRowsJson + code.slice(mzRowsEnd);
console.log("Successfully replaced Mz rows");

fs.writeFileSync(filePath, code, "utf8");
console.log("Timetable successfully patched matching IMG_4984!");
