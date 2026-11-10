const fs = require("fs");
const path = require("path");

const rawStudents = JSON.parse(fs.readFileSync(path.join(__dirname, "students_46.json"), "utf8"));

const fullKde = rawStudents.map((s, idx) => {
  const num = idx + 1;
  const isFemale = s.gender === "ស្រី";
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

fs.writeFileSync(path.join(__dirname, "kde_46.json"), JSON.stringify(fullKde), "utf8");
console.log("Generated kde_46.json with count:", fullKde.length);
console.log("First:", fullKde[0].name, fullKde[0].gender, fullKde[0].dob);
console.log("Last:", fullKde[45].name, fullKde[45].gender, fullKde[45].dob);
