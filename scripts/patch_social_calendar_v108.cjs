const fs = require("fs");
const ts = require("typescript");

const filePath = "public/assets/index-BwPwHqBe.js";
let code = fs.readFileSync(filePath, "utf8");

const uCeIdx = code.indexOf("uCe=[");
const sSoc = code.indexOf("{\"id\":\"social\"", uCeIdx);
const eSoc = code.indexOf(",{id:\"health\"", sSoc);
if (uCeIdx < 0 || sSoc < 0 || eSoc < 0) {
  throw new Error("Could not find social syllabus boundaries in uCe");
}

let soc = JSON.parse(code.slice(sSoc, eSoc));
soc.hasCalendarDates = true;

// Re-generate trimesters with calendar rows matching Math/Science (Nov 2026 - Aug 2027)
const DOW_KH = ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហ", "សុក្រ", "សៅរ៍"];
const MONTH_KH = {
  "2026-11": "១១_ខែ វិច្ឆិកា",
  "2026-12": "១២_ខែ ធ្នូ",
  "2027-01": "០១_ខែ មករា",
  "2027-02": "០២_ខែ កុម្ភៈ",
  "2027-03": "០៣_ខែ មីនា",
  "2027-04": "០៤_ខែ មេសា",
  "2027-05": "០៥_ខែ ឧសភា",
  "2027-06": "០៦_ខែ មិថុនា",
  "2027-07": "០៧_ខែ កក្កដា",
  "2027-08": "០៨_ខែ សីហា",
};
const WEEK_KH = ["", "ទី១", "ទី២", "ទី៣", "ទី៤"];

function fmtDateKh(d) {
  const dow = DOW_KH[d.getUTCDay()];
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(d.getUTCFullYear()).slice(-2);
  return `${dow}_${dd}_${mm}_${yy}`;
}

const HOLIDAYS = {
  "2026-11-01": "ថ្ងៃបើកបវេសនកាល",
  "2026-11-09": "ពិធីបុណ្យឯករាជ្យជាតិ ៩ វិច្ឆិកា",
  "2026-11-22": "ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក",
  "2026-11-23": "ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក",
  "2026-11-24": "ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក",
  "2026-12-29": "ទិវាសន្តិភាពនៅកម្ពុជា",
  "2027-01-01": "ចូលឆ្នាំសកល",
  "2027-01-07": "ទិវាជ័យជម្នះ៧មករា",
  "2027-03-08": "ទិវាអន្តរជាតិនារី",
  "2027-05-01": "ទិវាពលកម្មអន្តរជាតិ",
  "2027-05-14": "ព្រះរាជពិធីចម្រើនព្រះជន្ម ព្រះករុណាព្រះបាទសម្តេចព្រះបរមនាថ នរោត្តម សីហមុនី",
  "2027-05-20": "ពិធីបុណ្យវិសាខបូជា",
  "2027-05-24": "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល",
  "2027-06-18": "ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្តេចព្រះមហាក្សត្រី នរោត្តម មុនិនាថ សីហនុ",
};

const EXAMS = {
  "2026-12-16": "ប្រឡងប្រចាំខែធ្នូ",
  "2027-01-23": "ការប្រឡងប្រចាំខែមករា",
  "2027-02-20": "ប្រឡងប្រចាំខែកុម្ភៈ",
  "2027-03-17": "ប្រឡងប្រចាំខែមីនា",
  "2027-03-24": "ប្រឡងឆមាសទី១",
  "2027-05-22": "ប្រឡងប្រចាំខែឧសភា",
  "2027-06-16": "ប្រឡងប្រចាំខែមិថុនា",
  "2027-07-15": "តេស្តឆមាសទី២",
  "2027-07-24": "ប្រឡងប្រចាំខែកក្កដា",
  "2027-08-19": "ប្រឡងឆមាសទី២ (១០-២០ សីហា ២០២៧)",
};

const TECH_MEETINGS = new Set([
  "2027-01-28",
  "2027-02-25",
  "2027-03-25",
  "2027-04-29",
  "2027-05-27",
  "2027-06-24",
  "2027-07-29",
  "2027-08-26",
]);

function row(data) {
  return {
    chapterNo: data.chapterNo || "",
    month: data.month || "",
    weekNo: data.weekNo || "",
    calendarDate: data.calendarDate || "",
    title: data.title || "",
    hours: data.hours || "",
    objective: data.objective || "",
    topics: [],
    studentBookPages: data.studentBookPages || "",
    teacherBookPages: data.teacherBookPages || "",
    ...(data.isSundayRow ? { isSundayRow: true } : {}),
    ...(data.isHolidayRow ? { isHolidayRow: true } : {}),
    ...(data.isThursdayRow ? { isThursdayRow: true } : {}),
    ...(data.isExamRow ? { isExamRow: true } : {}),
    ...(data.isLessonHeader ? { isLessonHeader: true } : {}),
    ...(data.isSectionHeader ? { isSectionHeader: true } : {}),
  };
}

// Collect all existing units/chapters from soc trimesters (excluding pure headers or flattening them)
const oldChapters = soc.trimesters.flatMap(t => t.chapters);
// Filter out pure empty or placeholder rows to get actual teaching units/sections
const unitQueue = oldChapters.filter(c => c.title && c.title !== "");

const trimRows = { 1: [], 2: [], 3: [] };
let qIdx = 0;

function trimesterForYm(ym) {
  if (ym === "2026-11" || ym === "2026-12" || ym === "2027-01") return 1;
  if (ym === "2027-02" || ym === "2027-03" || ym === "2027-04") return 2;
  return 3;
}

const startDate = new Date(Date.UTC(2026, 10, 1));
const endDate = new Date(Date.UTC(2027, 7, 31));
let curYm = "";
let weekNum = 1;
let aprBreakAdded = false;
let waterFestAdded = false;

for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
  const iso = d.toISOString().slice(0, 10);
  const ym = iso.slice(0, 7);
  const dow = d.getUTCDay();
  const day = d.getUTCDate();
  if (ym !== curYm) {
    curYm = ym;
    weekNum = 1;
  } else if (dow === 0 && day >= 5) {
    weekNum = Math.min(4, weekNum + 1);
  }

  const mLabel = MONTH_KH[ym];
  const wLabel = WEEK_KH[weekNum];
  const tri = trimesterForYm(ym);
  const dateStr = fmtDateKh(d);

  if (iso === "2026-11-01") {
    trimRows[tri].push(row({ month: mLabel, weekNo: wLabel, calendarDate: dateStr, title: HOLIDAYS[iso], isHolidayRow: true }));
    continue;
  }
  if (iso >= "2026-11-02" && iso <= "2026-11-07") {
    if (dow === 4) {
      trimRows[tri].push(row({ month: mLabel, weekNo: wLabel, calendarDate: dateStr, title: "ពលកម្ម", isThursdayRow: true }));
    } else {
      trimRows[tri].push(row({ month: mLabel, weekNo: wLabel, calendarDate: dateStr, title: "ធ្វើតេស្តដើមឆ្នាំនិងបំប៉នសិស្ស" }));
    }
    continue;
  }
  if (iso >= "2026-11-22" && iso <= "2026-11-24") {
    if (!waterFestAdded) {
      waterFestAdded = true;
      trimRows[tri].push(row({ month: mLabel, weekNo: "ទី៤", calendarDate: "អាទិត្យ_22_11_26\nចន្ទ_23_11_26\nអង្គារ_24_11_26", title: "ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក", isHolidayRow: true }));
    }
    continue;
  }
  if (iso >= "2027-04-06" && iso <= "2027-04-19") {
    if (!aprBreakAdded) {
      aprBreakAdded = true;
      trimRows[tri].push(row({ month: mLabel, weekNo: "ទី១", calendarDate: "អង្គារ_06_04_27 .. សៅរ៍_10_04_27", title: "វិស្សមកាលតូច (ចាប់ពីថ្ងៃទី៦ ដល់ថ្ងៃទី១៩ ខែមេសា ឆ្នាំ២០២៧)", isHolidayRow: true }));
      trimRows[tri].push(row({ month: mLabel, weekNo: "ទី២", calendarDate: "អាទិត្យ_11_04_27", title: "", isSundayRow: true }));
      trimRows[tri].push(row({ month: mLabel, weekNo: "ទី២", calendarDate: "ចន្ទ_12_04_27 .. សៅរ៍_17_04_27\n(បុណ្យចូលឆ្នាំថ្មី ១៤-១៥-១៦ មេសា)", title: "វិស្សមកាលតូច និងពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ", isHolidayRow: true }));
      trimRows[tri].push(row({ month: mLabel, weekNo: "ទី៣", calendarDate: "អាទិត្យ_18_04_27", title: "", isSundayRow: true }));
      trimRows[tri].push(row({ month: mLabel, weekNo: "ទី៣", calendarDate: "ចន្ទ_19_04_27", title: "វិស្សមកាលតូច (ថ្ងៃបញ្ចប់)", isHolidayRow: true }));
    }
    continue;
  }
  if (iso >= "2027-08-25" && iso <= "2027-08-31") {
    if (iso === "2027-08-26") {
      trimRows[tri].push(row({ month: mLabel, weekNo: "ទី៤", calendarDate: dateStr, title: "ប្រជុំបច្ចេកទេសតាមកម្រង", isThursdayRow: true }));
    } else if (iso === "2027-08-29") {
      trimRows[tri].push(row({ month: mLabel, weekNo: "ទី៤", calendarDate: dateStr, title: "", isSundayRow: true }));
    } else if (iso === "2027-08-31") {
      trimRows[tri].push(row({ month: mLabel, weekNo: "ទី៤", calendarDate: dateStr, title: "បិទបញ្ចប់ឆ្នាំសិក្សា ២០២៦-២០២៧ និងរៀបចំលទ្ធផលប្រឡង" }));
    }
    continue;
  }
  if (HOLIDAYS[iso]) {
    trimRows[tri].push(row({ month: mLabel, weekNo: wLabel, calendarDate: dateStr, title: HOLIDAYS[iso], isHolidayRow: true }));
    continue;
  }
  if (dow === 0) {
    trimRows[tri].push(row({ month: mLabel, weekNo: wLabel, calendarDate: dateStr, title: "", isSundayRow: true }));
    continue;
  }
  if (EXAMS[iso]) {
    trimRows[tri].push(row({ month: mLabel, weekNo: wLabel, calendarDate: dateStr, title: EXAMS[iso], hours: dow === 4 ? "" : "1", isExamRow: true }));
    continue;
  }
  if (dow === 4) {
    const isNovDec = ym === "2026-11" || ym === "2026-12";
    trimRows[tri].push(row({
      month: mLabel,
      weekNo: wLabel,
      calendarDate: dateStr,
      title: isNovDec ? "ពលកម្ម" : TECH_MEETINGS.has(iso) ? "ប្រជុំបច្ចេកទេសតាមកម្រង" : "បំប៉នភាសាខ្មែរ គណិតវិទ្យា អប់រំបំណិនជីវិត",
      isThursdayRow: true,
    }));
    continue;
  }

  // Social Studies teaching days: Mon to Fri (1 hour each = 5 hours/week)
  if (dow < 1 || dow > 5) continue;

  if (qIdx < unitQueue.length) {
    const unit = unitQueue[qIdx++];
    trimRows[tri].push(row({
      chapterNo: unit.chapterNo || "",
      month: mLabel,
      weekNo: wLabel,
      calendarDate: dateStr,
      title: unit.title,
      hours: unit.hours || "1",
      objective: unit.objective || "",
      studentBookPages: unit.studentBookPages || "",
      teacherBookPages: unit.teacherBookPages || "",
      ...(unit.isSectionHeader ? { isSectionHeader: true } : {}),
    }));
  }
}

soc.trimesters[0].chapters = trimRows[1];
soc.trimesters[1].chapters = trimRows[2];
soc.trimesters[2].chapters = trimRows[3];

// Add migration key for social syllabus exact calendar v108
const migrationBlock =
  'if(!localStorage.getItem("migrated_social_syllabus_calendar_v108")){const Oe=uCe.find(qe=>qe.id==="social");if(Oe){res=res.some(qe=>qe.id==="social")?res.map(qe=>qe.id==="social"?Oe:qe):[...res,Oe];localStorage.setItem("migrated_social_syllabus_calendar_v108","1");changed=!0}}';

// Update bundle uCe
const newSocStr = JSON.stringify(soc);
code = code.slice(0, sSoc) + newSocStr + code.slice(eSoc);

// Add migration block into ECe migration function if not present
if (!code.includes("migrated_social_syllabus_calendar_v108")) {
  const targetStr = 'if(Array.isArray(Xe)){let changed=!1,res=Xe;';
  if (code.includes(targetStr)) {
    code = code.replace(targetStr, targetStr + migrationBlock);
  }
}

fs.writeFileSync(filePath, code, "utf8");
console.log("Successfully patched Social Studies with calendar dates and v108 migration!");
