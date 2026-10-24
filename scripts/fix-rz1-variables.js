import fs from "node:fs";

const filePath = "scripts/rz_lesson1_code.js";
let content = fs.readFileSync(filePath, "utf8");

console.log("Renaming f$ and h$ in rz_lesson1_code.js to avoid bundle conflicts...");

// Replace f$ with scienceLesson1RowsMorning
content = content.replaceAll("f$", "scienceLesson1RowsMorning");
// Replace h$ with scienceLesson1RowsAfternoon
content = content.replaceAll("h$", "scienceLesson1RowsAfternoon");
// Also check for Mz just in case
content = content.replaceAll("Mz", "scienceLesson1TimetableData");

fs.writeFileSync(filePath, content);
console.log("Renamed variables in rz_lesson1_code.js successfully.");
