const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

function toArabicDigits(str) {
  if (!str) return "";
  return String(str).replace(/[០-៩]/g, d => "0123456789"["០១២៣៤៥៦៧៨៩".indexOf(d)]);
}

function parseDateRobust(val) {
  if (val === null || val === undefined || val === "") return "01/01/2015";
  if (typeof val === "number" && val > 10000 && val < 60000) {
    const d = new Date(Math.round((val - 25569) * 86400 * 1000));
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }
  const t = String(val).trim();
  const dmy = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) {
    return `${dmy[1].padStart(2, "0")}/${dmy[2].padStart(2, "0")}/${dmy[3]}`;
  }
  const ymd = t.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (ymd) {
    return `${ymd[3].padStart(2, "0")}/${ymd[2].padStart(2, "0")}/${ymd[1]}`;
  }
  return t;
}

function parseStudentRows(rawRows, startIndex = 0) {
  if (!rawRows || !rawRows.length) return { students: [], meta: {} };

  const meta = {};
  // Extract metadata from the first 12 rows
  for (let i = 0; i < Math.min(12, rawRows.length); i++) {
    const rowStr = (Array.isArray(rawRows[i]) ? rawRows[i].join(" ") : String(rawRows[i])).trim();
    if (rowStr.includes("សាលា") || rowStr.includes("សាលាបឋមសិក្សា")) {
      const match = rowStr.match(/(?:សាលាបឋមសិក្សា[^\s,]+|សាលា[^\s,]+)/);
      meta.schoolName = rowStr;
    }
    if (rowStr.includes("ថ្នាក់") || rowStr.includes("កម្រិត")) {
      const gMatch = rowStr.match(/(?:ថ្នាក់[\s:]*[^\s,]+)/);
      meta.grade = gMatch ? gMatch[0] : "ថ្នាក់ 6-ក";
    }
    if (rowStr.includes("សរុប") || rowStr.includes("ស្រី")) {
      const tot = rowStr.match(/សិស្សសរុប[\s:]*\d+[\s]*នាក់/);
      const fem = rowStr.match(/ស្រី[\s:]*\d+[\s]*នាក់/);
      if (tot) meta.totalCount = tot[0];
      if (fem) meta.femaleCount = fem[0];
    }
  }

  // Find table header row
  let headerRowIdx = -1;
  let colMap = {
    roll: 0,
    name: 1,
    gender: 2,
    dob: 3,
    pob: 4,
    fatherName: 5,
    fatherJob: 6,
    motherName: 7,
    motherJob: 8,
    address: 9,
    ethnicity: 10,
    disability: 11,
    note: 12
  };

  for (let r = 0; r < Math.min(25, rawRows.length); r++) {
    const row = Array.isArray(rawRows[r]) ? rawRows[r] : String(rawRows[r]).split(",");
    const rowText = row.map(c => String(c || "").trim()).join(" ");
    
    if (
      (rowText.includes("ល.រ") || rowText.includes("លរ") || rowText.includes("No")) &&
      (rowText.includes("នាម") || rowText.includes("ឈ្មោះ") || rowText.includes("Name"))
    ) {
      headerRowIdx = r;
      // Build dynamic column map from header
      let fatherSeen = false;
      let motherSeen = false;

      row.forEach((col, idx) => {
        const h = String(col || "").trim().toLowerCase();
        if (h.includes("ល.រ") || h.includes("លរ") || h === "no" || h.includes("លេខរៀង")) {
          colMap.roll = idx;
        } else if (
          (h.includes("នាមត្រកូល") || h.includes("គោត្តនាម") || (h.includes("ឈ្មោះ") && !h.includes("ឪពុក") && !h.includes("ម្តាយ") && !h.includes("ម្ដាយ"))) ||
          h === "name" || h === "fullname"
        ) {
          colMap.name = idx;
        } else if (h.includes("ភេទ") || h === "sex" || h === "gender") {
          colMap.gender = idx;
        } else if (h.includes("កំណើត") && !h.includes("ទីកន្លែង") && !h.includes("កន្លែង")) {
          colMap.dob = idx;
        } else if (h.includes("ទីកន្លែង") || h.includes("កន្លែងកំណើត") || h === "pob") {
          colMap.pob = idx;
        } else if (h.includes("ឪពុក") || h.includes("father")) {
          colMap.fatherName = idx;
          fatherSeen = true;
        } else if (h.includes("មុខរបរ") || h.includes("job") || h.includes("occupation")) {
          if (fatherSeen && !motherSeen) {
            colMap.fatherJob = idx;
          } else if (motherSeen) {
            colMap.motherJob = idx;
          }
        } else if (h.includes("ម្តាយ") || h.includes("ម្ដាយ") || h.includes("mother")) {
          colMap.motherName = idx;
          motherSeen = true;
        } else if (h.includes("លំនៅដ្ឋាន") || h.includes("អាសយដ្ឋាន") || h.includes("address") || h.includes("ទីលំនៅ")) {
          colMap.address = idx;
        } else if (h.includes("ជនជាតិ") || h.includes("ក្រីក្រ") || h.includes("ethnicity")) {
          colMap.ethnicity = idx;
        } else if (h.includes("ពិការ") || h.includes("disability")) {
          colMap.disability = idx;
        } else if (h.includes("ផ្សេង") || h.includes("note") || h.includes("remark") || h.includes("សេចក្តីផ្សេងៗ")) {
          colMap.note = idx;
        }
      });
      break;
    }
  }

  const startRow = headerRowIdx >= 0 ? headerRowIdx + 1 : 0;
  const students = [];
  let baseId = Date.now();

  for (let r = startRow; r < rawRows.length; r++) {
    const row = Array.isArray(rawRows[r]) ? rawRows[r] : String(rawRows[r]).split(",");
    if (!row || !row.length || row.every(c => !String(c || "").trim())) continue;

    const rowText = row.map(c => String(c || "").trim()).join(" ");
    
    // Stop / Skip on footer signatures or notices
    if (
      rowText.includes("បានឃើញ និងឯកភាព") ||
      rowText.includes("បានឃើញនិងឯកភាព") ||
      rowText.includes("នាយកសាលា") ||
      rowText.includes("គ្រូបន្ទុកថ្នាក់") ||
      rowText.includes("ថ្ងៃចន្ទ") ||
      rowText.includes("ថ្ងៃអង្គារ") ||
      rowText.includes("ធ្វើនៅ") ||
      rowText.includes("ពុទ្ធសករាជ") ||
      rowText.includes("ហាស់ សាវិន") ||
      rowText.includes("ហត្ថលេខា")
    ) {
      break; // Reached end of student table!
    }

    const getVal = (idx) => (idx !== undefined && row[idx] !== undefined ? String(row[idx]).trim() : "");

    let rawRoll = getVal(colMap.roll);
    let name = getVal(colMap.name);

    // If name is in roll position because roll column was omitted
    if (!name && rawRoll && isNaN(parseInt(toArabicDigits(rawRoll), 10))) {
      name = rawRoll;
      rawRoll = "";
    }

    // If still no name, skip
    if (!name || name.length < 2) continue;
    // If name contains table header leftovers
    if (name.includes("នាមត្រកូល") || name.includes("ឈ្មោះសិស្ស") || name.includes("សិស្សសរុប")) continue;

    let rollNum = parseInt(toArabicDigits(rawRoll), 10);
    if (isNaN(rollNum) || rollNum <= 0) {
      rollNum = startIndex + students.length + 1;
    }

    const rawGender = getVal(colMap.gender);
    const gender = (rawGender.includes("ស្រី") || rawGender.toLowerCase() === "f" || rawGender.toLowerCase() === "female") ? "ស្រី" : "ប្រុស";

    const dob = parseDateRobust(row[colMap.dob]);
    const pob = getVal(colMap.pob);
    const fatherName = getVal(colMap.fatherName);
    const fatherJob = getVal(colMap.fatherJob);
    const motherName = getVal(colMap.motherName);
    const motherJob = getVal(colMap.motherJob);
    const address = getVal(colMap.address) || pob;
    const rawEthnicity = getVal(colMap.ethnicity);
    const ethnicity = rawEthnicity || "ខ្មែរ";
    const rawDisability = getVal(colMap.disability);
    const disability = rawDisability || "មិនមាន";
    const note = getVal(colMap.note);

    const civilId = `SIS-${1000 + startIndex + students.length + 1}`;
    const plpAccount = `student${startIndex + students.length + 1}@plp.edu.kh`;
    const parentPhone = "012 345 678";

    students.push({
      id: baseId++,
      rollNo: rollNum,
      name,
      gender,
      dob,
      pob: pob || undefined,
      fatherName: fatherName || undefined,
      fatherJob: fatherJob || undefined,
      motherName: motherName || undefined,
      motherJob: motherJob || undefined,
      address: address || undefined,
      ethnicity,
      disability,
      disabilityType: disability && disability !== "មិនមាន" && disability !== "គ្មាន" ? disability : undefined,
      indigenousEthnicity: ethnicity && ethnicity !== "ខ្មែរ" && ethnicity !== "មិនមាន" ? ethnicity : undefined,
      familyStatus: "ទូទៅ",
      note: note || undefined,
      parentPhone,
      civilId,
      plpAccount
    });
  }

  return { students, meta };
}

// Test on generated Excel file:
const wb = XLSX.readFile(path.join(process.cwd(), "public", "បញ្ជីសិស្ស-ថ្នាក់6ក-សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល.xlsx"));
const sheetName = wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" });

const result = parseStudentRows(rows, 0);
console.log("Parsed students count:", result.students.length);
console.log("Metadata:", result.meta);
console.log("First 3 students:", result.students.slice(0, 3));
console.log("Last 3 students:", result.students.slice(-3));
