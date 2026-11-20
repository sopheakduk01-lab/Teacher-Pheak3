const fs = require("fs");
const ts = require("typescript");

const filePath = "public/assets/index-BwPwHqBe.js";
let code = fs.readFileSync(filePath, "utf8");

function replaceExact(target, replacement, label) {
  const first = code.indexOf(target);
  if (first === -1) {
    throw new Error("Target not found for: " + label);
  }
  const second = code.indexOf(target, first + 1);
  if (second !== -1) {
    throw new Error("Target is not unique (" + label + "), second at " + second);
  }
  code = code.slice(0, first) + replacement + code.slice(first + target.length);
  console.log("Replaced:", label);
}

// ---------------------------------------------------------------------------
// 1. Replace normKh .. zw with hardened Khmer/MoEYS Excel & CSV parser
// ---------------------------------------------------------------------------
const normStart = code.indexOf("function normKh(");
const ssStart = code.indexOf("const SS=", normStart);
if (normStart === -1 || ssStart === -1) {
  throw new Error("Could not locate normKh..SS boundaries");
}
const oldParserBlock = code.slice(normStart, ssStart);

const newParserBlock = `function normKh(str){
  if(str===null||str===void 0)return"";
  return String(str).replace(/[\\u200B-\\u200D\\uFEFF]/g,"").replace(/\\u00A0/g," ").replace(/[\\r\\n\\t]+/g," ").replace(/ {2,}/g," ").trim();
}
function normKhKey(str){
  return normKh(str).replace(/\\u17D2\\u178A/g,"\\u17D2\\u178F").toLowerCase();
}
function decodeTextSmart(buf){
  const u8=buf instanceof Uint8Array?buf:new Uint8Array(buf);
  if(u8.length>=2&&u8[0]===0xFF&&u8[1]===0xFE)return new TextDecoder("utf-16le").decode(u8.subarray(2));
  if(u8.length>=2&&u8[0]===0xFE&&u8[1]===0xFF)return new TextDecoder("utf-16be").decode(u8.subarray(2));
  if(u8.length>=3&&u8[0]===0xEF&&u8[1]===0xBB&&u8[2]===0xBF)return new TextDecoder("utf-8").decode(u8.subarray(3));
  let zeroEven=0,zeroOdd=0,checkLen=Math.min(u8.length,200);
  for(let i=0;i+1<checkLen;i+=2){if(u8[i]===0)zeroEven++;if(u8[i+1]===0)zeroOdd++;}
  if(checkLen>=16&&zeroOdd>checkLen*0.25&&zeroEven<checkLen*0.08)return new TextDecoder("utf-16le").decode(u8);
  if(checkLen>=16&&zeroEven>checkLen*0.25&&zeroOdd<checkLen*0.08)return new TextDecoder("utf-16be").decode(u8);
  return new TextDecoder("utf-8").decode(u8);
}
function X2(r){
  const t=[];let s="",a=!1;
  if(r.includes("\\t")&&r.split("\\t").length>=3)return r.split("\\t").map(n=>normKh(n.replace(/^["']|["']$/g,"")));
  if(r.includes(";")&&!r.includes(",")&&r.split(";").length>=3)return r.split(";").map(n=>normKh(n.replace(/^["']|["']$/g,"")));
  for(let n=0;n<r.length;n++){
    const i=r[n];
    i==='"'||i==="'"?a&&r[n+1]===i?(s+=i,n++):a=!a:i===","&&!a?(t.push(normKh(s)),s=""):s+=i;
  }
  return t.push(normKh(s)),t.map(n=>normKh(n.replace(/^["']|["']$/g,"")));
}
function toArabicDigits(str){
  if(str===null||str===void 0)return"";
  return String(str).replace(/[០-៩]/g,d=>"0123456789"["០១២៣៤៥៦៧៨៩".indexOf(d)]);
}
function R_(r){
  if(r===null||r===void 0||r==="")return"01/01/2015";
  if(r instanceof Date&&!isNaN(r.getTime())){
    const d=String(r.getUTCDate()).padStart(2,"0"),m=String(r.getUTCMonth()+1).padStart(2,"0"),y=r.getUTCFullYear();
    return\`\${d}/\${m}/\${y}\`;
  }
  if(typeof r==="number"&&r>1e4&&r<6e4){
    const d=new Date(Math.round((r-25569)*86400*1e3)),day=String(d.getUTCDate()).padStart(2,"0"),month=String(d.getUTCMonth()+1).padStart(2,"0"),year=d.getUTCFullYear();
    return\`\${day}/\${month}/\${year}\`;
  }
  const t=toArabicDigits(normKh(r));
  if(/^\\d{5}$/.test(t)){
    const num=Number(t);
    if(num>1e4&&num<6e4){
      const d=new Date(Math.round((num-25569)*86400*1e3)),day=String(d.getUTCDate()).padStart(2,"0"),month=String(d.getUTCMonth()+1).padStart(2,"0"),year=d.getUTCFullYear();
      return\`\${day}/\${month}/\${year}\`;
    }
  }
  if(t.includes("GMT")||t.length>25){
    const d=new Date(t);
    if(!isNaN(d.getTime())){
      const day=String(d.getDate()).padStart(2,"0"),month=String(d.getMonth()+1).padStart(2,"0"),year=d.getFullYear();
      return\`\${day}/\${month}/\${year}\`;
    }
  }
  const s=t.match(/^(\\d{1,2})[\\/.\\-](\\d{1,2})[\\/.\\-](\\d{4})$/);
  if(s)return\`\${s[1].padStart(2,"0")}/\${s[2].padStart(2,"0")}/\${s[3]}\`;
  const s2=t.match(/^(\\d{1,2})[\\/.\\-](\\d{1,2})[\\/.\\-](\\d{2})$/);
  if(s2){const yy=Number(s2[3]),yyyy=yy<=35?2e3+yy:1900+yy;return\`\${s2[1].padStart(2,"0")}/\${s2[2].padStart(2,"0")}/\${yyyy}\`;}
  const a=t.match(/^(\\d{4})[\\/.\\-](\\d{1,2})[\\/.\\-](\\d{1,2})$/);
  if(a)return\`\${a[3].padStart(2,"0")}/\${a[2].padStart(2,"0")}/\${a[1]}\`;
  return t;
}
function parseStudentRows(rawRows,startIndex=0){
  if(!rawRows||!rawRows.length)return{students:[],meta:{}};
  const normRows=rawRows.map(r=>Array.isArray(r)?r.map(c=>c instanceof Date||typeof c==="number"?c:normKh(c)):X2(String(r||""))),meta={};
  for(let i=0;i<Math.min(25,normRows.length);i++){
    const rowStr=normRows[i].map(c=>normKh(c)).filter(Boolean).join(" ");
    if(!rowStr)continue;
    if(rowStr.includes("សាលាបឋមសិក្សា")||rowStr.includes("សាលា")){
      const sCell=normRows[i].map(c=>normKh(c)).find(c=>c.includes("សាលា"));
      meta.schoolName=sCell||"សាលាបឋមសិក្សាហ៊ុនសែនអូរឫស្សីកណ្តាល";
    }
    if(rowStr.includes("ថ្នាក់")||rowStr.includes("កម្រិត")){
      const gMatch=toArabicDigits(rowStr).match(/(?:ថ្នាក់[ទី\\s:]*[^\\s,]+(?:\\s*[-–]?\\s*[ក-អA-Za-z0-9]+)?)/);
      meta.grade=gMatch?gMatch[0]:"ថ្នាក់: 6-ក";
    }
    if(rowStr.includes("សរុប")||rowStr.includes("ស្រី")){
      const arabicStr=toArabicDigits(rowStr),tot=arabicStr.match(/សិស្សសរុប[\\s:]*\\d+[\\s]*នាក់/),fem=arabicStr.match(/ស្រី[\\s:]*\\d+[\\s]*នាក់/);
      tot&&(meta.totalCount=tot[0]),fem&&(meta.femaleCount=fem[0]);
    }
  }
  let hRowIdx=-1,hasExplicitCols=!1;
  let colMap={roll:0,name:1,gender:2,dob:3,pob:4,fatherName:5,fatherJob:6,motherName:7,motherJob:8,address:9,ethnicity:10,disability:11,note:12};
  for(let r=0;r<Math.min(60,normRows.length);r++){
    const row=normRows[r],rowText=normKhKey(row.map(c=>normKh(c)).join(" "));
    const hasRoll=rowText.includes("ល.រ")||rowText.includes("ល. រ")||rowText.includes("លរ")||rowText.includes("លេខរៀង")||/\\bno\\.?\\b/i.test(rowText);
    const hasName=rowText.includes("នាមត្រកូល")||rowText.includes("គោត្តនាម")||rowText.includes("នាម និង")||rowText.includes("នាមខ្លួន")||rowText.includes("ឈ្មោះសិស្ស")||rowText.includes("ឈ្មោះ")||/\\bname\\b/i.test(rowText);
    const hasGender=rowText.includes("ភេទ")||/\\bgender\\b|\\bsex\\b/i.test(rowText);
    const hasDob=rowText.includes("ថ្ងៃខែឆ្នាំកំណើត")||rowText.includes("ថ្ងៃកំណើត")||rowText.includes("កំណើត")||/\\bdob\\b/i.test(rowText);
    const hasExtra=rowText.includes("ឪពុក")||rowText.includes("ម្តាយ")||rowText.includes("លំនៅដ្ឋាន")||rowText.includes("អាសយដ្ឋាន")||rowText.includes("អត្តលេខ");
    if(hasName&&(hasRoll||hasGender||hasDob||hasExtra)){
      hRowIdx=r;hasExplicitCols=!0;
      const detected={};
      let fS=!1,mS=!1;
      const applyHeaders=(hRow,isSub)=>{
        hRow.forEach((col,idx)=>{
          const h=normKhKey(col);
          if(!h)return;
          if(isSub){
            if(h==="ប្រុស"||h==="ប"){detected.maleCol=idx;return;}
            if(h==="ស្រី"||h==="ស"){detected.femaleCol=idx;return;}
            if(h==="ថ្ងៃ"){detected.dobDay=idx;return;}
            if(h==="ខែ"){detected.dobMonth=idx;return;}
            if(h==="ឆ្នាំ"){detected.dobYear=idx;return;}
            if(h.includes("មុខរបរ")||h.includes("job")||h.includes("occupation")){
              if(detected.motherName!==void 0&&idx>=detected.motherName)detected.motherJob=idx;
              else if(!mS&&detected.fatherJob===void 0)detected.fatherJob=idx;
              else detected.motherJob=idx;
              return;
            }
            if(h==="ឈ្មោះ"||h.includes("ឈ្មោះ")){
              if(detected.motherName!==void 0&&idx>=detected.motherName){detected.motherName=idx;mS=!0;return;}
              if(detected.fatherName!==void 0&&idx>=detected.fatherName){detected.fatherName=idx;fS=!0;return;}
              if(detected.name!==void 0||detected.surname!==void 0)return;
            }
          }
          if(!isSub&&(h.includes("ល.រ")||h.includes("ល. រ")||h==="លរ"||h==="ល.រ."||h==="លេខ"||h==="no"||h==="no."||h.includes("លេខរៀង"))){detected.roll=idx;return;}
          if(h.includes("អត្តលេខ")||h.includes("លេខសម្គាល់")||h==="id"||h==="student id"||h==="civilid"){detected.civilId=idx;return;}
          if(((h.includes("គោត្តនាម")||h.includes("នាមត្រកូល"))&&(h.includes("និងនាម")||h.includes("-នាម")||h.includes(" នាម")||h.includes("នាមខ្លួន")))||h.includes("នាម និងគោត្តនាម")||h.includes("នាម និង គោត្តនាម")||h.includes("ឈ្មោះសិស្ស")||h==="fullname"||h==="full name"||h==="student name"||(h==="name"&&!h.includes("father")&&!h.includes("mother"))){detected.name=idx;return;}
          if((h==="គោត្តនាម"||h==="នាមត្រកូល"||h==="last name"||h==="surname")&&detected.name===void 0){detected.surname=idx;return;}
          if((h==="នាម"||h==="នាមខ្លួន"||h==="first name"||h==="given name")&&detected.name===void 0){detected.givenName=idx;return;}
          if(!isSub&&h.includes("ឈ្មោះ")&&!h.includes("ឪពុក")&&!h.includes("ម្តាយ")){detected.name=idx;return;}
          if(h.includes("ភេទ")||h==="sex"||h==="gender"){detected.gender=idx;return;}
          if((h.includes("កំណើត")&&!h.includes("ទីកន្លែង")&&!h.includes("កន្លែង"))||h==="dob"||h.includes("birth date")||h.includes("ថ្ងៃខែឆ្នាំ")){detected.dob=idx;return;}
          if(h.includes("ទីកន្លែង")||h.includes("កន្លែងកំណើត")||h==="pob"||h.includes("place of birth")){detected.pob=idx;return;}
          if(h.includes("ឪពុក")||h.includes("father")){if(h.includes("មុខរបរ")||h.includes("job"))detected.fatherJob=idx;else{detected.fatherName=idx;fS=!0;}return;}
          if(h.includes("ម្តាយ")||h.includes("mother")){if(h.includes("មុខរបរ")||h.includes("job"))detected.motherJob=idx;else{detected.motherName=idx;mS=!0;}return;}
          if(h.includes("មុខរបរ")||h.includes("job")||h.includes("occupation")){if(!mS&&detected.fatherJob===void 0)detected.fatherJob=idx;else detected.motherJob=idx;return;}
          if(h.includes("លំនៅដ្ឋាន")||h.includes("អាសយដ្ឋាន")||h.includes("address")||h.includes("ទីលំនៅ")){detected.address=idx;return;}
          if(h.includes("ជនជាតិ")||h.includes("ethnicity")){detected.ethnicity=idx;return;}
          if(h.includes("ពិការ")||h.includes("disability")){detected.disability=idx;return;}
          if(h.includes("ទូរស័ព្ទ")||h.includes("ទូរសព្ទ")||h.includes("phone")||h.includes("tel")){detected.parentPhone=idx;return;}
          if(h.includes("ស្ថានភាព")||h.includes("ក្រីក្រ")||h.includes("បណ្ណក្រីក្រ")){detected.familyStatus=idx;return;}
          if(h.includes("ផ្សេង")||h.includes("note")||h.includes("remark")||h.includes("សេចក្តីផ្សេងៗ")){detected.note=idx;}
        });
      };
      applyHeaders(row,!1);
      if(r+1<normRows.length){
        const nextRow=normRows[r+1],nextNonEmpty=nextRow.map(c=>normKh(c)).filter(Boolean);
        const nextRowText=normKhKey(nextNonEmpty.join(" "));
        const isNumSub=nextNonEmpty.length>=3&&nextNonEmpty.every(c=>/^[\\d០-៩().,-]+$/.test(c));
        const isWordSub=(nextRowText.includes("មុខរបរ")||nextRowText.includes("ឈ្មោះ")||nextRowText.includes("ប្រុស")||nextRowText.includes("ស្រី")||nextRowText.includes("ថ្ងៃ")||nextRowText.includes("ខែ")||nextRowText.includes("ឆ្នាំ"))&&!nextNonEmpty.some(c=>/^(\\d{1,2}[\\/.-]\\d{1,2}[\\/.-]\\d{2,4})$/.test(toArabicDigits(c)));
        if(isNumSub){hRowIdx=r+1;}
        else if(isWordSub){applyHeaders(nextRow,!0);hRowIdx=r+1;}
      }
      if(detected.name===void 0&&detected.surname!==void 0&&detected.givenName===void 0)detected.name=detected.surname;
      if(detected.name===void 0&&detected.givenName!==void 0&&detected.surname===void 0)detected.name=detected.givenName;
      colMap=detected;
      break;
    }
  }
  let inferredStart=0;
  if(hRowIdx===-1){
    for(let r=0;r<Math.min(40,normRows.length);r++){
      const row=normRows[r];
      if(!row)continue;
      const nonEmpty=row.map((c,i)=>({i,v:normKh(c)})).filter(x=>x.v!=="");
      if(nonEmpty.length<2)continue;
      const rowJoined=normKhKey(nonEmpty.map(x=>x.v).join(" "));
      if(rowJoined.includes("ព្រះរាជាណាចក្រ")||rowJoined.includes("ជាតិ សាសនា")||rowJoined.includes("មន្ទីរអប់រំ")||rowJoined.includes("ការិយាល័យអប់រំ")||rowJoined.includes("បញ្ជីសិស្ស")||rowJoined.includes("បញ្ជីរាយនាម")||rowJoined.includes("សាលាបឋម"))continue;
      const genderHit=nonEmpty.find(x=>{const g=normKhKey(x.v);return g==="ប្រុស"||g==="ស្រី"||g==="ស"||g==="ប"||g==="m"||g==="f"||g==="male"||g==="female";});
      const firstRoll=nonEmpty.find(x=>/^\\d{1,3}$/.test(toArabicDigits(x.v)));
      if(genderHit||(firstRoll&&nonEmpty.length>=2)){
        inferredStart=r;
        const c0=firstRoll?firstRoll.i:nonEmpty[0].i;
        const inferred={};
        if(firstRoll)inferred.roll=firstRoll.i;
        if(genderHit){
          inferred.gender=genderHit.i;
          const nameCand=nonEmpty.find(x=>x.i!==(firstRoll?firstRoll.i:-1)&&x.i!==genderHit.i&&x.v.length>=2&&!/^\\d+$/.test(toArabicDigits(x.v)));
          if(nameCand)inferred.name=nameCand.i;
          const dobCand=nonEmpty.find(x=>x.i>genderHit.i&&/\\d{1,4}[\\/.-]\\d{1,2}[\\/.-]\\d{1,4}|^\\d{5}$/.test(toArabicDigits(x.v)));
          if(dobCand)inferred.dob=dobCand.i;
        }else{
          inferred.roll=c0;inferred.name=c0+1;inferred.gender=c0+2;inferred.dob=c0+3;inferred.pob=c0+4;inferred.fatherName=c0+5;inferred.fatherJob=c0+6;inferred.motherName=c0+7;inferred.motherJob=c0+8;inferred.address=c0+9;inferred.ethnicity=c0+10;inferred.disability=c0+11;inferred.note=c0+12;
        }
        colMap=inferred;
        break;
      }
    }
  }
  const sRow=hRowIdx>=0?hRowIdx+1:inferredStart,students=[];
  let baseId=Date.now();
  for(let r=sRow;r<normRows.length;r++){
    const row=normRows[r];
    if(!row||!row.length||row.every(c=>!normKh(c)))continue;
    const rText=normKhKey(row.map(c=>normKh(c)).join(" ")),getVal=idx=>idx!==void 0&&row[idx]!==void 0?normKh(row[idx]):"";
    let name="";
    if(colMap.surname!==void 0&&colMap.givenName!==void 0){
      name=[getVal(colMap.surname),getVal(colMap.givenName)].filter(Boolean).join(" ").trim();
    }else{
      name=getVal(colMap.name);
    }
    let rawRoll=getVal(colMap.roll);
    const isFooter=rText.includes("បានឃើញ")||rText.includes("នាយកសាលា")||rText.includes("គ្រូបន្ទុកថ្នាក់")||rText.includes("ធ្វើនៅ")||rText.includes("ពុទ្ធសករាជ")||rText.includes("បញ្ឈប់បញ្ជី")||rText.includes("ហាស់ សាវិន");
    if(isFooter&&(!name||name.includes("បានឃើញ")||name.includes("នាយក")||name.includes("គ្រូបន្ទុក")||name.includes("ធ្វើនៅ")||name.includes("បញ្ឈប់")))break;
    if(!hasExplicitCols&&!name&&rawRoll&&isNaN(parseInt(toArabicDigits(rawRoll),10))){name=rawRoll;rawRoll="";}
    const cleanDigitsName=toArabicDigits(name),nameKey=normKhKey(name);
    if(!name||name.length<2||/^[\\d.,-]+$/.test(cleanDigitsName)||nameKey.includes("នាមត្រកូល")||nameKey.includes("គោត្តនាម")||nameKey.includes("ឈ្មោះសិស្ស")||nameKey.includes("សិស្សសរុប")||nameKey.includes("បញ្ជីសិស្ស")||nameKey.includes("ព្រះរាជាណាចក្រ")||nameKey.includes("ជាតិ សាសនា")||name==="ឈ្មោះ")continue;
    let rollNum=parseInt(toArabicDigits(rawRoll),10);
    (isNaN(rollNum)||rollNum<=0)&&(rollNum=startIndex+students.length+1);
    let gender="ប្រុស";
    if(colMap.maleCol!==void 0&&colMap.femaleCol!==void 0){
      const fv=normKhKey(getVal(colMap.femaleCol)),mv=normKhKey(getVal(colMap.maleCol));
      if(fv&&fv!=="0"&&fv!=="-")gender="ស្រី";
      else if(mv&&mv!=="0"&&mv!=="-")gender="ប្រុស";
      else if(colMap.gender!==void 0){
        const rawG=getVal(colMap.gender),lowG=normKhKey(rawG);
        if(lowG.includes("ស្រី")||lowG==="ស"||lowG==="f"||lowG==="female"||lowG==="girl")gender="ស្រី";
      }
    }else{
      const rawG=getVal(colMap.gender),lowG=normKhKey(rawG);
      gender=lowG.includes("ស្រី")||lowG==="ស"||lowG==="f"||lowG==="female"||lowG==="girl"?"ស្រី":"ប្រុស";
    }
    let dob="01/01/2015";
    if(colMap.dobDay!==void 0&&colMap.dobMonth!==void 0&&colMap.dobYear!==void 0){
      const dd=toArabicDigits(getVal(colMap.dobDay)),mm=toArabicDigits(getVal(colMap.dobMonth)),yy=toArabicDigits(getVal(colMap.dobYear));
      dob=dd&&mm&&yy?R_(\`\${dd}/\${mm}/\${yy}\`):R_(colMap.dob!==void 0?row[colMap.dob]:"");
    }else{
      const rawDobCell=colMap.dob!==void 0?row[colMap.dob]:"";
      dob=R_(rawDobCell);
    }
    const pob=getVal(colMap.pob),fName=getVal(colMap.fatherName),fJob=getVal(colMap.fatherJob),mName=getVal(colMap.motherName),mJob=getVal(colMap.motherJob),addr=getVal(colMap.address)||pob,rawEth=getVal(colMap.ethnicity),eth=rawEth||"ខ្មែរ",rawDis=getVal(colMap.disability),dis=rawDis||"មិនមាន",note=getVal(colMap.note),civ=getVal(colMap.civilId),pPhone=getVal(colMap.parentPhone),fStat=getVal(colMap.familyStatus);
    students.push({
      id:baseId++,
      rollNo:rollNum,
      name,
      gender,
      dob,
      pob:pob||void 0,
      fatherName:fName||void 0,
      fatherJob:fJob||void 0,
      motherName:mName||void 0,
      motherJob:mJob||void 0,
      address:addr||void 0,
      ethnicity:eth,
      disability:dis,
      disabilityType:dis&&dis!=="មិនមាន"&&dis!=="គ្មាន"?dis:void 0,
      indigenousEthnicity:eth&&eth!=="ខ្មែរ"&&eth!=="មិនមាន"&&eth!=="គ្មាន"?eth:void 0,
      familyStatus:fStat||"ទូទៅ",
      note:note||void 0,
      parentPhone:pPhone||"012 345 678",
      civilId:civ||\`SIS-\${1e3+startIndex+students.length+1}\`,
      plpAccount:\`student\${startIndex+students.length+1}@plp.edu.kh\`,
      pin:"1234"
    });
  }
  return{students,meta};
}
function zw(r,t=0){
  if(!r||!r.trim())return{students:[],meta:{}};
  const clean=r.replace(/^\\uFEFF/,"");
  if(/<table|<tr/i.test(clean)){
    const hRows=parseHtmlTableRows(clean);
    if(hRows.length>0){const hp=parseStudentRows(hRows,t);if(hp.students.length>0)return hp;}
  }
  const s=clean.split(/\\r?\\n/).map(d=>X2(d));
  return parseStudentRows(s,t);
}
`.replace(/\n\s*/g, " ");

replaceExact(oldParserBlock, newParserBlock, "normKh..zw");

// ---------------------------------------------------------------------------
// 2. Replace sheetToRawRows..vtt to fix HTML .xls UTF-8 mojibake & "###" cells
// ---------------------------------------------------------------------------
const oldVttBlock = `function sheetToRawRows(ws){if(!ws)return[];const ref=ws["!ref"];if(ref&&Gm.decode_range&&Gm.encode_cell){try{const range=Gm.decode_range(ref),rows=[];for(let R=range.s.r;R<=range.e.r;R++){const row=[];for(let C=range.s.c;C<=range.e.c;C++){const addr=Gm.encode_cell({r:R,c:C}),cell=ws[addr];if(!cell){row.push("");continue}if(cell.t==="d"&&cell.v instanceof Date)row.push(cell.v);else if(cell.t==="n"&&typeof cell.v==="number"&&cell.v>1e4&&cell.v<6e4&&cell.z&&/[dmy]/i.test(cell.z))row.push(cell.v);else if(cell.w!==void 0&&cell.w!=="")row.push(String(cell.w));else if(cell.v!==void 0)row.push(cell.v);else row.push("")}rows.push(row)}if(rows.length>0)return rows}catch(e){}}return Gm.sheet_to_json(ws,{header:1,raw:!1,defval:""})}function parseHtmlTableRows(htmlText){try{if(typeof DOMParser<"u"){const doc=new DOMParser().parseFromString(htmlText,"text/html"),trs=Array.from(doc.querySelectorAll("tr"));return trs.map(tr=>{const cells=[];Array.from(tr.querySelectorAll("th,td")).forEach(td=>{const txt=normKh(td.textContent||""),span=Math.max(1,parseInt(td.getAttribute("colspan")||"1",10)||1);cells.push(txt);for(let k=1;k<span;k++)cells.push("")});return cells})}}catch(e){}return[]}async function vtt(r,t=0){const s=await r.arrayBuffer();try{const a=EA(s,{type:"array",cellDates:!1,cellNF:!0});if(a&&a.SheetNames&&a.SheetNames.length>0){const preferred=a.SheetNames.find(h=>h.includes("សិស្ស")||h.includes("ថ្នាក់")||/student|list/i.test(h))||a.SheetNames[0],orderedSheets=[preferred,...a.SheetNames.filter(n=>n!==preferred)];for(const sheetName of orderedSheets){const ws=a.Sheets[sheetName];if(!ws)continue;const rows=sheetToRawRows(ws),parsed=parseStudentRows(rows,t);if(parsed&&parsed.students&&parsed.students.length>0)return parsed}}}catch(e){console.warn("SheetJS parse fallback triggered:",e)}try{const txt=new TextDecoder("utf-8").decode(s);if(/<table|<tr/i.test(txt)){const hRows=parseHtmlTableRows(txt),hParsed=parseStudentRows(hRows,t);if(hParsed&&hParsed.students&&hParsed.students.length>0)return hParsed}const cParsed=zw(txt,t);if(cParsed&&cParsed.students&&cParsed.students.length>0)return cParsed}catch(e2){console.warn("Text/HTML fallback error:",e2)}return{students:[],meta:{}}}`;

const newVttBlock = `function sheetToRawRows(ws){
  if(!ws)return[];
  const ref=ws["!ref"];
  if(ref&&Gm.decode_range&&Gm.encode_cell){
    try{
      const range=Gm.decode_range(ref),rows=[];
      for(let R=range.s.r;R<=range.e.r;R++){
        const row=[];
        for(let C=range.s.c;C<=range.e.c;C++){
          const addr=Gm.encode_cell({r:R,c:C}),cell=ws[addr];
          if(!cell){row.push("");continue;}
          if(cell.t==="d"&&cell.v instanceof Date)row.push(cell.v);
          else if(cell.t==="n"&&typeof cell.v==="number"&&cell.v>1e4&&cell.v<6e4&&cell.z&&/[dmy]/i.test(cell.z))row.push(cell.v);
          else if(cell.w!==void 0&&cell.w!==""&&!/^#+$/.test(String(cell.w).trim()))row.push(String(cell.w));
          else if(cell.v!==void 0)row.push(cell.v);
          else row.push("");
        }
        rows.push(row);
      }
      if(rows.length>0)return rows;
    }catch(e){}
  }
  return Gm.sheet_to_json(ws,{header:1,raw:!1,defval:""});
}
function parseHtmlTableRows(htmlText){
  try{
    if(typeof DOMParser<"u"){
      const doc=new DOMParser().parseFromString(htmlText,"text/html"),trs=Array.from(doc.querySelectorAll("tr"));
      return trs.map(tr=>{
        const cells=[];
        Array.from(tr.querySelectorAll("th,td")).forEach(td=>{
          const txt=normKh(td.textContent||""),span=Math.max(1,parseInt(td.getAttribute("colspan")||"1",10)||1);
          cells.push(txt);
          for(let k=1;k<span;k++)cells.push("");
        });
        return cells;
      });
    }
  }catch(e){}
  return[];
}
async function vtt(r,t=0){
  const s=await r.arrayBuffer(),u8=new Uint8Array(s);
  const isZip=u8.length>=2&&u8[0]===0x50&&u8[1]===0x4B;
  const isOle=u8.length>=4&&u8[0]===0xD0&&u8[1]===0xCF&&u8[2]===0x11&&u8[3]===0xE0;
  if(!isZip&&!isOle){
    try{
      const txt=decodeTextSmart(u8);
      if(/<table|<tr/i.test(txt)){
        const hRows=parseHtmlTableRows(txt),hParsed=parseStudentRows(hRows,t);
        if(hParsed&&hParsed.students&&hParsed.students.length>0)return hParsed;
      }
      if(!/^\\s*<\\?xml|<Workbook/i.test(txt)){
        const cParsed=zw(txt,t);
        if(cParsed&&cParsed.students&&cParsed.students.length>0)return cParsed;
      }
    }catch(e0){console.warn("Pre-SheetJS text/HTML parse notice:",e0);}
  }
  try{
    const a=EA(u8,{type:"array",cellDates:!1,cellNF:!0});
    if(a&&a.SheetNames&&a.SheetNames.length>0){
      const preferred=a.SheetNames.find(h=>h.includes("សិស្ស")||h.includes("ថ្នាក់")||/student|list/i.test(h))||a.SheetNames[0];
      const orderedSheets=[preferred,...a.SheetNames.filter(n=>n!==preferred)];
      for(const sheetName of orderedSheets){
        const ws=a.Sheets[sheetName];
        if(!ws)continue;
        const rows=sheetToRawRows(ws),parsed=parseStudentRows(rows,t);
        if(parsed&&parsed.students&&parsed.students.length>0)return parsed;
      }
    }
  }catch(e){console.warn("SheetJS parse fallback triggered:",e);}
  try{
    const txt=decodeTextSmart(u8);
    if(/<table|<tr/i.test(txt)){
      const hRows=parseHtmlTableRows(txt),hParsed=parseStudentRows(hRows,t);
      if(hParsed&&hParsed.students&&hParsed.students.length>0)return hParsed;
    }
    const cParsed=zw(txt,t);
    if(cParsed&&cParsed.students&&cParsed.students.length>0)return cParsed;
  }catch(e2){console.warn("Text/HTML fallback error:",e2);}
  return{students:[],meta:{}};
}`.replace(/\n\s*/g, " ");

replaceExact(oldVttBlock, newVttBlock, "sheetToRawRows..vtt");

// ---------------------------------------------------------------------------
// 3. Fix Xb and ju for smart binary/UTF-16/UTF-8 reading + inline error info
// ---------------------------------------------------------------------------
const oldXbJu = `Xb=async oe=>{Vd(!0),fd(oe.name),f([]),g({});try{if(/\\.(xlsx|xls|xlsm|xlsb|ods)$/i.test(oe.name)){const{students:ir,meta:Or}=await vtt(oe,il?0:n.length);ir.length>0?(f(ir),g(Or),F(\`បានអានឯកសារ Excel: រកឃើញសិស្សចំនួន \${ir.length} នាក់!\`)):F("មិនអាចរកឃើញទិន្នន័យសិស្សក្នុងឯកសារ Excel នេះទេ។")}else{const ir=await oe.text();ud(ir);const{students:Or,meta:Wr}=zw(ir,il?0:n.length);Or.length>0?(f(Or),g(Wr),F(\`បានអានឯកសារ CSV: រកឃើញសិស្សចំនួន \${Or.length} នាក់!\`)):F("មិនអាចរកឃើញទិន្នន័យសិស្សក្នុងឯកសារ CSV នេះទេ។")}}catch(ft){console.error("Error reading file:",ft),F("មានបញ្ហាក្នុងការអានឯកសារ សូមពិនិត្យមើលឯកសារឡើងវិញ។")}finally{Vd(!1)}},ju=oe=>{oe.preventDefault();let ft=[],ir={};if(Se.length>0)ft=Se,ir=b;else if(gu.trim()){const{students:Or,meta:Wr}=zw(gu,il?0:n.length);ft=Or,ir=Wr}else{F("សូមបញ្ចូល ឬផ្ទុកឡើងឯកសារ Excel / CSV ជាមុនសិន!");return}if(ft.length>0){o(ft,il),ud(""),f([]),fd(""),g({}),Fc(!1);let Or=\`បាននាំចូលសិស្សចំនួន \${ft.length} នាក់ពី Excel Workbook ដោយជោគជ័យ!\`;ir.grade&&(Or+=\` (\${ir.grade})\`),F(Or)}else F("មិនអាចអានទិន្នន័យបានទេ សូមពិនិត្យទម្រង់ Excel / CSV ឡើងវិញ។")}`;

const newXbJu = `Xb=async oe=>{
  Vd(!0),fd(oe.name),f([]),g({});
  try{
    const buf=await oe.arrayBuffer(),u8=new Uint8Array(buf);
    const isBinaryExcel=/\\.(xlsx|xls|xlsm|xlsb|ods)$/i.test(oe.name)||(u8.length>=2&&u8[0]===0x50&&u8[1]===0x4B)||(u8.length>=4&&u8[0]===0xD0&&u8[1]===0xCF&&u8[2]===0x11&&u8[3]===0xE0);
    if(isBinaryExcel){
      const{students:ir,meta:Or}=await vtt(oe,il?0:n.length);
      ir.length>0?(f(ir),g(Or),F(\`បានអានឯកសារ Excel: រកឃើញសិស្សចំនួន \${ir.length} នាក់!\`)):(g({parseError:"មិនអាចរកឃើញទិន្នន័យសិស្សក្នុងឯកសារ Excel នេះទេ។ សូមពិនិត្យថាតើមានជួរឈរ «ល.រ», «នាមត្រកូល និងនាម» (ឬ «គោត្តនាម», «នាម»), «ភេទ» ឬទាញយកគំរូ Excel ខាងលើមកប្រើ។"}),F("មិនអាចរកឃើញទិន្នន័យសិស្សក្នុងឯកសារ Excel នេះទេ។"));
    }else{
      const ir=decodeTextSmart(u8);
      ud(ir);
      const{students:Or,meta:Wr}=zw(ir,il?0:n.length);
      Or.length>0?(f(Or),g(Wr),F(\`បានអានឯកសារ CSV: រកឃើញសិស្សចំនួន \${Or.length} នាក់!\`)):(g({parseError:"មិនអាចរកឃើញទិន្នន័យសិស្សក្នុងឯកសារ CSV នេះទេ។ សូមពិនិត្យក្បាលតារាង ឬបិទភ្ជាប់អត្ថបទខាងក្រោម។"}),F("មិនអាចរកឃើញទិន្នន័យសិស្សក្នុងឯកសារ CSV នេះទេ។"));
    }
  }catch(ft){
    console.error("Error reading file:",ft);
    g({parseError:"មានបញ្ហាក្នុងការអានឯកសារ៖ "+(ft&&ft.message?ft.message:"ទម្រង់ឯកសារមិនត្រឹមត្រូវ")});
    F("មានបញ្ហាក្នុងការអានឯកសារ សូមពិនិត្យមើលឯកសារឡើងវិញ។");
  }finally{Vd(!1);}
},ju=oe=>{
  oe.preventDefault();
  let ft=[],ir={};
  if(Se.length>0)ft=Se,ir=b;
  else if(gu.trim()){const{students:Or,meta:Wr}=zw(gu,il?0:n.length);ft=Or,ir=Wr;}
  else{g({parseError:"សូមជ្រើសរើសឯកសារ Excel/CSV ឬចម្លងបិទភ្ជាប់ទិន្នន័យសិស្សជាមុនសិន!"}),F("សូមបញ្ចូល ឬផ្ទុកឡើងឯកសារ Excel / CSV ជាមុនសិន!");return;}
  if(ft.length>0){
    try{
      o(ft,il),ud(""),f([]),fd(""),g({}),Fc(!1);
      let Or=\`បាននាំចូលសិស្សចំនួន \${ft.length} នាក់ពី Excel Workbook ដោយជោគជ័យ!\`;
      ir.grade&&(Or+=\` (\${ir.grade})\`),F(Or);
    }catch(err){
      console.error("Import apply error:",err);
      g({parseError:"មានបញ្ហាពេលរក្សាទុកទិន្នន័យសិស្ស៖ "+(err&&err.message?err.message:"Quota ពេញ")});
      F("មានបញ្ហាពេលរក្សាទុកទិន្នន័យសិស្ស!");
    }
  }else{
    g({parseError:"មិនអាចអានទិន្នន័យសិស្សបានទេ សូមពិនិត្យទម្រង់ជួរឈរ (ល.រ, នាមត្រកូល និងនាម, ភេទ) ឡើងវិញ។"});
    F("មិនអាចអានទិន្នន័យបានទេ សូមពិនិត្យទម្រង់ Excel / CSV ឡើងវិញ។");
  }
}`.replace(/\n\s*/g, " ");

replaceExact(oldXbJu, newXbJu, "Xb..ju");

// ---------------------------------------------------------------------------
// 4. Update Import Modal file input accept + inline parseError alert
// ---------------------------------------------------------------------------
const oldModalInput = `e.jsx("input",{type:"file",accept:".xlsx,.xls,.xlsm,.xlsb,.ods,.csv,.txt,.tsv",onChange:oe=>{var ir;const ft=(ir=oe.target.files)==null?void 0:ir[0];oe.target.value="",ft&&Xb(ft)},className:"absolute inset-0 opacity-0 cursor-pointer w-full h-full"})`;
const newModalInput = `e.jsx("input",{type:"file",accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.oasis.opendocument.spreadsheet,text/csv,text/tab-separated-values,text/plain,.xlsx,.xls,.xlsm,.xlsb,.ods,.csv,.txt,.tsv",onChange:async oe=>{var ir;const el=oe.target,ft=(ir=el.files)==null?void 0:ir[0];if(ft){await Xb(ft);}try{el.value="";}catch{}},className:"absolute inset-0 opacity-0 cursor-pointer w-full h-full"})`;

replaceExact(oldModalInput, newModalInput, "modal file input");

const oldModalPreviewCheck = `Se.length>0&&e.jsxs("div",{className:"bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3"`;
const newModalPreviewCheck = `(b==null?void 0:b.parseError)&&Se.length===0&&e.jsxs("div",{className:"bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2",children:[e.jsx("span",{className:"shrink-0",children:"⚠️"}),e.jsx("span",{children:b.parseError})]}),Se.length>0&&e.jsxs("div",{className:"bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3"`;

replaceExact(oldModalPreviewCheck, newModalPreviewCheck, "modal parseError alert");

// ---------------------------------------------------------------------------
// 5. Fix Fe / pe / Ae / Je uncaught QuotaExceededError on localStorage.setItem
// ---------------------------------------------------------------------------
const oldStudentCallbacks = `const pe=ke=>{const bt={id:Date.now(),rollNo:u.length+1,...ke},pt=[...u,bt];h(pt),Gr(n,"students",pt),Gr(n,"last_modified",Date.now()),localStorage.setItem(\`\${Si}_students\`,JSON.stringify(pt)),Re(\`បានបញ្ចូលសិស្ស \${bt.name} និងរក្សាទុកជោគជ័យ!\`)},Ae=ke=>{const st=u.map(bt=>bt.id===ke.id?ke:bt);h(st),Gr(n,"students",st),Gr(n,"last_modified",Date.now()),localStorage.setItem(\`\${Si}_students\`,JSON.stringify(st)),Re("បានកែប្រែ និងរក្សាទុកទិន្នន័យសិស្សជោគជ័យ")},Fe=(ke,st=!1)=>{const bt=st?ke:[...u,...ke];h(bt),Gr(n,"students",bt),Gr(n,"last_modified",Date.now()),localStorage.setItem(\`\${Si}_students\`,JSON.stringify(bt)),Re(\`បាននាំចូលសិស្សចំនួន \${ke.length} នាក់ និងរក្សាទុកដោយជោគជ័យ!\`)},Je=ke=>{if(window.confirm("តើអ្នកពិតជាចង់លុបឈ្មោះសិស្សនេះមែនទេ?")){const st=u.filter(bt=>bt.id!==ke);h(st),Gr(n,"students",st),Gr(n,"last_modified",Date.now()),localStorage.setItem(\`\${Si}_students\`,JSON.stringify(st)),Re("បានលុបឈ្មោះសិស្សដោយជោគជ័យ")}}`;

const newStudentCallbacks = `const saveStuFallback=arr=>{try{localStorage.setItem(\`\${Si}_students\`,JSON.stringify(arr))}catch(e){console.warn("Fallback students localStorage notice:",e)}},pe=ke=>{const bt={id:Date.now(),rollNo:u.length+1,...ke},pt=[...u,bt];h(pt),Gr(n,"students",pt),Gr(n,"last_modified",Date.now()),saveStuFallback(pt),Re(\`បានបញ្ចូលសិស្ស \${bt.name} និងរក្សាទុកជោគជ័យ!\`)},Ae=ke=>{const st=u.map(bt=>bt.id===ke.id?ke:bt);h(st),Gr(n,"students",st),Gr(n,"last_modified",Date.now()),saveStuFallback(st),Re("បានកែប្រែ និងរក្សាទុកទិន្នន័យសិស្សជោគជ័យ")},Fe=(ke,st=!1)=>{const bt=st?ke:[...u,...ke];h(bt),Gr(n,"students",bt),Gr(n,"last_modified",Date.now()),saveStuFallback(bt),Re(\`បាននាំចូលសិស្សចំនួន \${ke.length} នាក់ និងរក្សាទុកដោយជោគជ័យ!\`)},Je=ke=>{if(window.confirm("តើអ្នកពិតជាចង់លុបឈ្មោះសិស្សនេះមែនទេ?")){const st=u.filter(bt=>bt.id!==ke);h(st),Gr(n,"students",st),Gr(n,"last_modified",Date.now()),saveStuFallback(st),Re("បានលុបឈ្មោះសិស្សដោយជោគជ័យ")}}`;

replaceExact(oldStudentCallbacks, newStudentCallbacks, "pe/Ae/Fe/Je safe localStorage");

// ---------------------------------------------------------------------------
// 6. Fix Zl so imported lists of 6, 39, or 49 students are NOT overwritten on reload
// ---------------------------------------------------------------------------
const oldZlCheck = `const migKey="migrated_moeys_46_students_6k_v102";const isOldData=!Array.isArray(st)||st.length===0||st.length===49||st.length===39||st.length===6||(st[0]&&st[0].name==="កទៀត រ៉មី")||(st[0]&&st[0].name==="សុខ ចាន់ថន")||(st[0]&&st[0].name==="នួន ស្រីរ័ត្ន")||!localStorage.getItem(migKey);`;
const newZlCheck = `const migKey="migrated_moeys_46_students_6k_v102";const hasMigrated=!!localStorage.getItem(migKey);const isOldData=!hasMigrated&&(!Array.isArray(st)||st.length===0||st.length===49||st.length===39||st.length===6||(st[0]&&st[0].name==="កទៀត រ៉មី")||(st[0]&&st[0].name==="សុខ ចាន់ថន")||(st[0]&&st[0].name==="នួន ស្រីរ័ត្ន"));`;

replaceExact(oldZlCheck, newZlCheck, "Zl safe migration check");

// ---------------------------------------------------------------------------
// 7. Syntax validation via TypeScript parser & write output
// ---------------------------------------------------------------------------
const sf = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
const diags = sf.parseDiagnostics || [];
console.log("TypeScript parseDiagnostics:", diags.length);
if (diags.length > 0) {
  for (const d of diags.slice(0, 5)) {
    console.error("Diag:", d.messageText, "at", d.start);
  }
  process.exit(1);
}

fs.writeFileSync(filePath, code, "utf8");
console.log("Successfully updated", filePath, "bytes:", Buffer.byteLength(code, "utf8"));
