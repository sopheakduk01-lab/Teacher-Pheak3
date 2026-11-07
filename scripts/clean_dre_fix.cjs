const fs = require("fs");
const path = require("path");

const bundlePath = path.join(process.cwd(), "public", "assets", "index-BwPwHqBe.js");
let content = fs.readFileSync(bundlePath, "utf8");

// 1. Locate dre start
const dreStart = content.indexOf("dre=({students");
if (dreStart === -1) {
  console.error("dre not found!");
  process.exit(1);
}

// 2. Locate N=y.useMemo in dre
const memoIdx = content.indexOf("N=y.useMemo", dreStart);
if (memoIdx === -1) {
  console.error("N=y.useMemo not found in dre!");
  process.exit(1);
}

// Proper start of dre:
const properBeforeMemo = `dre=({students:r,borrowings:t,libraryBooks:s,onAddBorrowing:a,onUpdateBorrowing:n,onDeleteBorrowing:i,activeBannerTheme:l})=>{const[o,c]=y.useState("roster"),[d,u]=y.useState(""),[h,m]=y.useState(null),[w,j]=y.useState(""),[lendRows,setLendRows]=y.useState(()=>{try{const s=localStorage.getItem("moeys_lend_register_35");if(s)return JSON.parse(s);}catch{}const ini=[];for(let k=1;k<=35;k++){const st=r[k-1]||{};ini.push({id:k,studentName:st.name||"",gender:st.gender||"",grade:st.grade||"ថ្នាក់ទី ៦",bookTitle:"",serialNo:"",borrowDate:"",studentSign:"",returnDate:"",teacherSign:"",remarks:""});}return ini;}),`;

content = content.slice(0, dreStart) + properBeforeMemo + content.slice(memoIdx);

// 3. Locate return of dre
const returnTarget = `return e.jsxs("div",{className:"space-y-4",children:`;
const returnIdx = content.indexOf(returnTarget, dreStart);
if (returnIdx === -1) {
  console.error("return of dre not found!");
  process.exit(1);
}

// We define printMoeysRegister cleanly:
const printCode = `;y.useEffect(()=>{try{localStorage.setItem("moeys_lend_register_35",JSON.stringify(lendRows));}catch{}},[lendRows]);const printMoeysRegister=()=>{const win=window.open("","_blank");if(!win)return;const rowsHtml=lendRows.map(row=>"<tr><td style=\\"border:1px solid #000;padding:4px;text-align:center;\\">"+fr(row.id)+"</td><td style=\\"border:1px solid #000;padding:4px;font-weight:bold;\\">"+(row.studentName||"")+"</td><td style=\\"border:1px solid #000;padding:4px;text-align:center;\\">"+(row.gender||"")+"</td><td style=\\"border:1px solid #000;padding:4px;text-align:center;\\">"+(row.grade||"")+"</td><td style=\\"border:1px solid #000;padding:4px;\\">"+(row.bookTitle||"")+"</td><td style=\\"border:1px solid #000;padding:4px;text-align:center;\\">"+(row.serialNo||"")+"</td><td style=\\"border:1px solid #000;padding:4px;text-align:center;\\">"+(row.borrowDate||"")+"</td><td style=\\"border:1px solid #000;padding:4px;text-align:center;\\">"+(row.studentSign||"")+"</td><td style=\\"border:1px solid #000;padding:4px;text-align:center;\\">"+(row.returnDate||"")+"</td><td style=\\"border:1px solid #000;padding:4px;text-align:center;\\">"+(row.teacherSign||"")+"</td><td style=\\"border:1px solid #000;padding:4px;\\">"+(row.remarks||"")+"</td></tr>").join("");win.document.write("<!DOCTYPE html><html lang=\\"km\\"><head><meta charset=\\"UTF-8\\"><title>បញ្ជីខ្ចី-សង ផ្លូវការ</title><style>@import url(\\"https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;700&family=Moul&display=swap\\");body{font-family:\\"Kantumruy Pro\\",sans-serif;padding:15px;color:#000;font-size:10pt;}.nation{font-family:\\"Moul\\",serif;font-size:11pt;text-align:center;}.title{font-family:\\"Moul\\",serif;font-size:14pt;text-align:center;margin:15px 0;}table{width:100%;border-collapse:collapse;margin-top:5px;}th{background:#f2f2f2;border:1px solid #000;padding:6px 4px;text-align:center;font-size:9pt;font-weight:bold;}td{border:1px solid #000;padding:4px;font-size:9pt;height:22px;vertical-align:middle;}@media print{body{padding:0;}button{display:none;}}</style></head><body><div style=\\"display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;\\"><div><div style=\\"font-weight:bold;font-size:10pt;\\">ព្រះរាជាណាចក្រកម្ពុជា</div><div class=\\"nation\\">ជាតិ សាសនា ព្រះមហាក្សត្រ</div><div style=\\"text-align:center;margin-top:3px;\\">— ༺ ៚ ༻ —</div></div><div style=\\"text-align:right;font-size:9pt;font-weight:bold;\\">សាលារៀន៖ "+(l.schoolName||"សាលាបឋមសិក្សាគំរូ")+"<br/>ថ្នាក់ទី៖ "+(l.gradeLevel||"ថ្នាក់ទី ៦")+"</div></div><div class=\\"title\\">បញ្ជីខ្ចី-សង</div><table><thead><tr><th rowspan=\\"2\\" style=\\"width:35px;\\">ល.រ</th><th rowspan=\\"2\\" style=\\"min-width:130px;\\">ឈ្មោះអ្នកខ្ចី</th><th rowspan=\\"2\\" style=\\"width:45px;\\">ភេទ</th><th rowspan=\\"2\\" style=\\"width:55px;\\">ថ្នាក់</th><th rowspan=\\"2\\" style=\\"min-width:180px;\\">បំណងជើងសៀវភៅ/សម្ភារៈ</th><th colspan=\\"3\\">កំណត់ត្រាខ្ចី</th><th colspan=\\"2\\">កំណត់ត្រាសង</th><th rowspan=\\"2\\" style=\\"min-width:80px;\\">ផ្សេងៗ</th></tr><tr><th style=\\"width:70px;\\">លេខសារភើកណ្ឌ</th><th style=\\"width:80px;\\">ថ្ងៃខែឆ្នាំខ្ចី</th><th style=\\"width:70px;\\">ហត្ថលេខាសិស្ស</th><th style=\\"width:80px;\\">ថ្ងៃខែឆ្នាំសង</th><th style=\\"width:70px;\\">ហត្ថលេខាបញ្ជាក់គ្រូ</th></tr></thead><tbody>"+rowsHtml+"</tbody></table><div style=\\"margin-top:20px;display:flex;justify-content:space-between;\\"><div></div><div style=\\"text-align:center;\\"><div>ថ្ងៃទី ........ ខែ ........ ឆ្នាំ ២០២...</div><div style=\\"font-family:Moul,serif;font-weight:bold;margin-top:5px;\\">គ្រូបន្ទុកថ្នាក់</div><div style=\\"height:50px;\\"></div><div style=\\"font-weight:bold;\\">"+(l.teacherName||"")+"</div></div></div><script>window.onload=()=>{window.print();};<\\/script></body></html>");win.document.close();};`;

content = content.slice(0, returnIdx) + printCode + content.slice(returnIdx);

fs.writeFileSync(bundlePath, content, "utf8");
console.log("Successfully cleaned up dre component in bundle!");
