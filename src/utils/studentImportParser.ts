import * as XLSX from 'xlsx';
import { Student } from '../types';

/**
 * Parses a single CSV line with support for quoted strings with commas and escaped quotes.
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  // Check if it's tab-separated
  if (line.includes('\t') && !line.includes(',')) {
    return line.split('\t').map(col => col.trim().replace(/^["']|["']$/g, ''));
  }

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' || char === "'") {
      if (inQuotes && line[i + 1] === char) {
        // Escaped quote
        current += char;
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  // Clean up any remaining outer quotes
  return result.map(col => col.replace(/^["']|["']$/g, '').trim());
}

/**
 * Normalizes date string from DD/MM/YYYY or DD-MM-YYYY to YYYY-MM-DD (or keeps YYYY-MM-DD)
 */
export function normalizeDate(dateStr: string): string {
  if (!dateStr) return '2016-01-01';
  const clean = dateStr.trim();

  // Match DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = clean.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Match YYYY-MM-DD
  const ymdMatch = clean.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return clean;
}

/**
 * Parses full CSV/Excel text into Student array with intelligent header and schema detection.
 */
export function parseStudentsCSV(
  csvText: string,
  existingCount: number = 0
): {
  students: Student[];
  meta: {
    schoolName?: string;
    grade?: string;
    totalCount?: string;
    femaleCount?: string;
  };
} {
  if (!csvText || !csvText.trim()) {
    return { students: [], meta: {} };
  }

  const rawLines = csvText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const meta: {
    schoolName?: string;
    grade?: string;
    totalCount?: string;
    femaleCount?: string;
  } = {};

  // Extract meta from top rows
  for (const line of rawLines.slice(0, 10)) {
    if (line.includes('សាលា') || line.includes('សាលាបឋមសិក្សា')) {
      const parts = parseCSVLine(line).filter(Boolean);
      if (parts[0]) meta.schoolName = parts[0];
    }
    if (line.includes('ថ្នាក់') || line.includes('កម្រិត')) {
      const parts = parseCSVLine(line).filter(Boolean);
      const gradePart = parts.find(p => p.includes('ថ្នាក់ទី') || p.includes('ថ្នាក់:'));
      if (gradePart) meta.grade = gradePart;
    }
    if (line.includes('សរុប') || line.includes('ស្រី')) {
      const parts = parseCSVLine(line).filter(Boolean);
      const totalPart = parts.find(p => p.includes('សរុប'));
      const femalePart = parts.find(p => p.includes('ស្រី'));
      if (totalPart) meta.totalCount = totalPart;
      if (femalePart) meta.femaleCount = femalePart;
    }
  }

  // Find header index
  let headerIndex = -1;
  let isMoEYSFormat = false;
  let isWikiSchoolFormat = false;

  for (let i = 0; i < rawLines.length; i++) {
    const cols = parseCSVLine(rawLines[i]);
    const rowText = cols.join(' ');

    if (
      (rowText.includes('ល.រ') || rowText.includes('លរ') || rowText.includes('No.')) &&
      (rowText.includes('គោត្តនាម') || rowText.includes('ឈ្មោះ') || rowText.includes('Name'))
    ) {
      headerIndex = i;
      isMoEYSFormat = true;
      break;
    } else if (
      rowText.includes('អត្តលេខ') ||
      rowText.includes('ឈ្មោះខ្មែរ') ||
      rowText.includes('គណនីPLP')
    ) {
      headerIndex = i;
      isWikiSchoolFormat = true;
      break;
    }
  }

  const dataLines = headerIndex >= 0 ? rawLines.slice(headerIndex + 1) : rawLines;
  const importedStudents: Student[] = [];
  let baseId = Date.now();

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i];
    const cols = parseCSVLine(line);

    // Skip empty or signature / approval footer lines
    if (cols.length === 0 || cols.every(c => !c)) continue;
    const combinedLine = cols.join(' ');
    if (
      combinedLine.includes('បានឃើញ និងឯកភាព') ||
      combinedLine.includes('នាយកសាលា') ||
      combinedLine.includes('គ្រូបន្ទុកថ្នាក់') ||
      combinedLine.includes('ថ្ងៃទី') ||
      combinedLine.includes('ហត្ថលេខា') ||
      combinedLine.includes('ប្រធាន') ||
      combinedLine.includes('សរុប:')
    ) {
      continue;
    }

    // Check if line has at least a name
    if (isMoEYSFormat || cols.length >= 4) {
      // Format 1: MoEYS Standard Format
      // 0: ល.រ (RollNo)
      // 1: គោត្តនាម នាម (Name)
      // 2: ភេទ (Gender)
      // 3: ថ្ងៃខែឆ្នាំកំណើត (DOB)
      // 4: ទីកន្លែងកំណើត (POB)
      // 5: ឪពុកឈ្មោះ (Father's Name)
      // 6: មុខរបរឪពុក / ទូរសព្ទ (Father's Job / Phone)
      // 7: ម្តាយឈ្មោះ (Mother's Name)
      // 8: មុខរបរម្តាយ (Mother's Job)
      // 9: ទីលំនៅបច្ចុប្បន្ន (Address)
      // 10: ស្ថានភាពគ្រួសារ / ផ្សេងៗ (Family status: ក្រ១, ក្រ២, ទូទៅ)
      // 11: សម្គាល់ (Note: នៅរស់, បាត់បង់...)

      // Check if Col 0 is a number (Roll No) or name
      let rollNo = parseInt(cols[0], 10);
      let name = cols[1] || '';
      let genderStr = cols[2] || '';
      let dobRaw = cols[3] || '';
      let pob = cols[4] || '';
      let fatherName = cols[5] || '';
      let fatherJob = cols[6] || '';
      let motherName = cols[7] || '';
      let motherJob = cols[8] || '';
      let address = cols[9] || '';
      let familyStatus = cols[10] || '';
      let note = cols[11] || cols[12] || '';

      // If col 0 isn't a number but has name
      if (isNaN(rollNo)) {
        if (cols[0] && !cols[1]) {
          name = cols[0];
          rollNo = existingCount + importedStudents.length + 1;
        } else {
          rollNo = existingCount + importedStudents.length + 1;
        }
      }

      if (!name && cols[0] && isNaN(parseInt(cols[0], 10))) {
        name = cols[0];
      }

      if (!name) continue; // Skip lines without student name

      const gender: 'ប្រុស' | 'ស្រី' =
        genderStr.includes('ស្រី') || genderStr.toLowerCase() === 'f' || genderStr.toLowerCase() === 'female'
          ? 'ស្រី'
          : 'ប្រុស';

      const dob = normalizeDate(dobRaw);

      // Check if fatherJob or motherJob contains a phone number
      let parentPhone = '012 345 678';
      const phoneInJob = (fatherJob + ' ' + motherJob + ' ' + note).match(/(0\d{8,9})/);
      if (phoneInJob) {
        parentPhone = phoneInJob[1];
      }

      // Generate Latin name & PLP
      const cleanName = name.replace(/\s+/g, '').toLowerCase();
      const civilId = `SIS-${1000 + existingCount + importedStudents.length + 1}`;
      const plpAccount = `${cleanName}@plp.edu.kh`;

      importedStudents.push({
        id: baseId++,
        rollNo: rollNo || existingCount + importedStudents.length + 1,
        name: name.trim(),
        gender,
        dob,
        pob: pob.trim() || undefined,
        fatherName: fatherName.trim() || undefined,
        fatherJob: fatherJob.trim() || undefined,
        motherName: motherName.trim() || undefined,
        motherJob: motherJob.trim() || undefined,
        address: address.trim() || pob.trim() || undefined,
        familyStatus: familyStatus.trim() || undefined,
        note: note.trim() || undefined,
        parentPhone,
        civilId,
        plpAccount,
      });
    } else {
      // Format 2: Standard WikiSchool Simple Format
      const name = cols[1] || cols[0];
      if (!name) continue;

      const latinName = cols[2] || '';
      const civilId = cols[0].startsWith('SIS') ? cols[0] : `SIS-${1000 + existingCount + importedStudents.length + 1}`;
      const gender: 'ប្រុស' | 'ស្រី' =
        cols[3] === 'ស្រី' || cols[3] === 'Female' ? 'ស្រី' : 'ប្រុស';
      const dob = normalizeDate(cols[4] || '2016-01-01');
      const address = cols[5] || '';
      const parentPhone = cols[6] || '012 345 678';
      const plpAccount = cols[7] || `${name.replace(/\s+/g, '').toLowerCase()}@plp.edu.kh`;

      importedStudents.push({
        id: baseId++,
        rollNo: existingCount + importedStudents.length + 1,
        name: name.trim(),
        latinName,
        civilId,
        gender,
        dob,
        address,
        parentPhone,
        plpAccount,
      });
    }
  }

  return { students: importedStudents, meta };
}

/**
 * Official Sample MoEYS 39-student dataset from user prompt
 */
export const SAMPLE_MOEYS_39_STUDENTS_CSV = `ក្រសួងអប់រំ យុវជន និងកីឡា,,,,,,,,,,,,
មន្ទីរ   អ.យ.ក   ខេត្តស្ទឹងត្រែង,,,,,,,,,,,,
ការិយាល័យ អប់រំ យុវជន និងកីឡា ស្រុក/ក្រុង សៀមបូក,,,,,,,,,,,,
សាលាបឋមសិក្សា ហ៊ុន សែន ស្រែពោធិ៍/អូរឫស្សីកណ្តាល/សៀមបូក/ស្ទឹងត្រែង,,,,,,,,,,,,
បញ្ជីរាយនាមសិស្សតាមកម្រិតថ្នាក់,,,,,,,,,,,,
កម្រិត/ថ្នាក់,,,,,,,,,,,,
ថ្នាក់ទី: 6-A,,,,,,,,,,,,
ចំនួនសិស្សសរុប: 39 នាក់,,,,,,,ស្រី: 26 នាក់,,,,,
ល.រ,គោត្តនាម នាម,ភេទ,ថ្ងៃខែឆ្នាំកំណើត,ទីកន្លែងកំណើត,ឪពុកឈ្មោះ,មុខរបរ,ម្តាយឈ្មោះ,មុខរបរ,ទីលំនៅបច្ចុប្បន្ន,ស្ថានភាពគ្រួសារ,សម្គាល់
1,នួន ស្រីរ័ត្ន,ស្រី,13/07/2013,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ខុយ វ៉ាន់នី,កសិករ,វ៉ា ស្រីមុំ,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ១,នៅរស់
2,វ៉ាន់ឌី សុជាតា,ស្រី,31/12/2009,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ឌី វ៉ាន់ឌឿន,កសិករ,ហ៊ង ស្រីដាវ,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ទូទៅ,នៅរស់
3,យុន ស្រីកែវ,ស្រី,07/07/2014,"ភូមិអូរកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",សោម វណ្ណា,កសិករ,យុន ម៉ៅ លាង,មេផ្ទះ,"ភូមិអូរកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,បាត់បង់ឳពុក
4,ខន វិច្ឆិកា,ស្រី,05/02/2013,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ខន វ៉ាន់នី,0976431123,សន ចន្ធី,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
5,រ៉េន ស្រីនិច,ប្រុស,10/10/2014,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",រ៉េន  សារឿន,កសិករ,ណាង  ស្រីណាក់,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,បាត់បង់ឳពុក
6,ខូ សុខកញ្ញា,ស្រី,15/04/2014,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ខូ សុខហៀង,កសិករ,រឿន សារុំ,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
7,ស៊ូ សុខណាឡែន,ប្រុស,13/05/2014,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ជួន  សុខា,កសិករ,ស៊ូ  សុខហៀង,មេផ្ទះ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
8,ទឹម ស្រីម៉េង,ស្រី,07/09/2013,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",នី សារឿន,កសិករ,នី សំអុល,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
9,អ៊ុ សុខមួយ,ប្រុស,10/07/2014,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ហោ  សុខណា,កសិករ,ស៊ឹម ស្រីនាង,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
10,ភិន សុខម៉េង,ស្រី,03/07/2014,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",សន ណាក់,,ភិន ណេ,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
11,ឈុន នីតា,ស្រី,03/09/2011,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ឃុន សាវី,កសិករ,ឈុន លី,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
12,ម៉ន ស្រីនាង,ស្រី,12/08/2014,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ហៃ ម៉ន,កសិករ,ម៉ៅ វ៉ាន់,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
13,ចែម ណារ៉ូ,ប្រុស,08/09/2014,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ភឹម សុជាតិ,កសិករ,ចែម សារ៉ាត់,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
14,ចេង ស្រីលីន,ប្រុស,20/09/2013,"ភូមិកោះព្នៅ, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",សុខ វ៉ាន់,កសិករ,ចេង ស្រីនាង,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
15,លី ពិសិដ្ឋ,ប្រុស,13/04/2011,"ភូមិអូរឫស្សីក្រោម, ឃុំសៀមបូក, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",សាន លី,កសិករ,ម៉ៅ ស្រីលី,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
16,ស៊ន សុផានិត,ប្រុស,23/08/2012,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ស៊ន វ៉ា,កសិករ,យី ស្រីមុំ,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
17,គឹម លីហៀង,ប្រុស,06/02/2014,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ខុយ វ៉ាន់នី,កសិករ,វ៉ា ស្រីមុំ,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
18,ហ៊ សុធារ៉ា,ប្រុស,04/06/2013,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ចន ហ៊,កសិករ,សឿន ស្រីម៉ៅ,មេផ្ទះ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ១,នៅរស់
19,សុខ ស្រីនាង,ប្រុស,15/02/2015,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",សុខ វ៉ាន់នី,កសិករ,ពៅ ស្រីណាក់,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ១,នៅរស់
20,ធួក ស្រីពេជ្រ,ប្រុស,10/07/2014,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ធួក វ៉ាន់ឌី,កសិករ,ស៊ឹម ស្រីនាង,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ១,នៅរស់
21,អ៊ុក ស្រីរ័ត្ន,ស្រី,27/11/2014,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",អ៊ុក សារឿន,កសិករ,អ៊ុក សារ៉ាត់,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
22,វ៉ន វិច្ឆិកា,ប្រុស,20/05/2014,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",វ៉ន សុខា,កសិករ,វ៉ន សារុំ,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,បាត់បង់ឳពុក
23,ញ៉ែម ស្រីលីន,ប្រុស,23/09/2012,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ញ៉ែម វ៉ា,កសិករ,សឿន ស្រីណាក់,កសិករ,"ភូមិអូរកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
24,សន វ៉ាន់,ប្រុស,14/10/2012,"ភូមិអូរកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",សន វ៉ា,កសិករ,សន វណ្ណា,កសិករ,"ភូមិអូរកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
25,ខន សុផាត,ប្រុស,26/12/2014,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ខន សារឿន,កសិករ,ខន សារុំ,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
26,ស៊ឹម ស្រីនាង,ស្រី,07/06/2014,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ស៊ឹម សារឿន,កសិករ,ស៊ឹម សារុំ,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
27,ម៉ៅ ស្រីលី,ប្រុស,09/01/2015,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ម៉ៅ វ៉ា,កសិករ,ម៉ៅ ស្រីមុំ,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
28,ខុយ ស្រីមុំ,ប្រុស,08/02/2013,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ខុយ វ៉ាន់នី,កសិករ,វ៉ា ស្រីមុំ,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ១,នៅរស់
29,ឌី ស្រីដាវ,ប្រុស,08/05/2014,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ឌី វ៉ាន់ឌឿន,កសិករ,ហ៊ង ស្រីដាវ,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
30,សោម វណ្ណា,ប្រុស,27/10/2014,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",សោម វណ្ណា,កសិករ,យុន ម៉ៅ លាង,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
31,សន ចន្ធី,ប្រុស,07/01/2014,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",សន វ៉ាន់នី,កសិករ,សន ចន្ធី,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ១,នៅរស់
32,ណាង ស្រីណាក់,ប្រុស,23/03/2012,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ណាង វ៉ា,កសិករ,ណាង ស្រីណាក់,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ១,នៅរស់
33,រឿន សារុំ,ប្រុស,08/08/2013,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",រឿន សុខហៀង,កសិករ,រឿន សារុំ,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
34,ជួន សុខា,ប្រុស,07/01/2015,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ជួន សុខា,កសិករ,ស៊ូ សុខហៀង,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
35,សំអុល សុភាពវឌ្ឍនារី,ស្រី,14/02/2013,"ភូមិអូរកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",អ៊ឹម សំអុល,កសិករ,ពឿន ស្រីម៉ៅ,កសិករ,"ភូមិអូរកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,បាត់បង់ឳពុកម្តាយ
36,សឿន ស្រីម៉ៅ,ស្រី,15/10/2014,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",សឿន វ៉ា,កសិករ,សឿន ស្រីម៉ៅ,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,បាត់បង់ឳពុក
37,ពៅ ស្រីណាក់,ប្រុស,15/09/2014,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ពៅ វ៉ាន់នី,កសិករ,ពៅ ស្រីណាក់,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
38,ធួក វ៉ាន់ឌី,ប្រុស,08/09/2014,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ធួក វ៉ាន់ឌី,កសិករ,ស៊ឹម ស្រីនាង,កសិករ,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់
39,អ៊ុក សារ៉ាត់,ស្រី,24/01/2012,"ភូមិអូរឫស្សីកណ្តាល, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",អ៊ុក វ៉ា,កសិករ,អ៊ុក សារ៉ាត់,កសិករ,"ភូមិរលួស, ឃុំអូរឫស្សីកណ្តាល, ស្រុកសៀមបូក, ខេត្តស្ទឹងត្រែង",ក្រ២,នៅរស់`;

/**
 * Parses an Excel Workbook file (.xlsx, .xls) using SheetJS
 */
export async function parseExcelWorkbookFile(
  file: File,
  existingCount: number = 0
): Promise<{
  students: Student[];
  meta: {
    schoolName?: string;
    grade?: string;
    totalCount?: string;
    femaleCount?: string;
  };
}> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return { students: [], meta: {} };

  const worksheet = workbook.Sheets[sheetName];
  // Convert worksheet to CSV string with proper encoding
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  return parseStudentsCSV(csv, existingCount);
}

/**
 * Exports students list to an authentic Microsoft Excel Workbook (.xlsx) file
 */
export function exportStudentsToExcelWorkbook(
  students: Student[],
  fileName: string = 'moeys_students_list.xlsx',
  schoolName: string = 'សាលាបឋមសិក្សា ហ៊ុន សែន ស្រែពោធិ៍',
  grade: string = 'ថ្នាក់ទី: 6-A'
) {
  const femaleCount = students.filter(s => s.gender === 'ស្រី').length;

  const headers = [
    ['ព្រះរាជាណាចក្រកម្ពុជា'],
    ['ជាតិ សាសនា ព្រះមហាក្សត្រ'],
    [''],
    ['ក្រសួងអប់រំ យុវជន និងកីឡា'],
    [schoolName],
    ['បញ្ជីរាយនាមសិស្សតាមកម្រិតថ្នាក់'],
    [`កម្រិត/ថ្នាក់: ${grade}`],
    [`ចំនួនសិស្សសរុប: ${students.length} នាក់ (ស្រី: ${femaleCount} នាក់)`],
    [''],
    [
      'ល.រ',
      'គោត្តនាម នាម',
      'ភេទ',
      'ថ្ងៃខែឆ្នាំកំណើត',
      'ទីកន្លែងកំណើត',
      'ឪពុកឈ្មោះ',
      'មុខរបរ',
      'ម្តាយឈ្មោះ',
      'មុខរបរ',
      'ទីលំនៅបច្ចុប្បន្ន',
      'ស្ថានភាពគ្រួសារ',
      'សម្គាល់'
    ]
  ];

  const rows = students.map((s, idx) => [
    s.rollNo || idx + 1,
    s.name,
    s.gender,
    s.dob || '',
    s.pob || s.address || '',
    s.fatherName || '',
    s.fatherJob || '',
    s.motherName || '',
    s.motherJob || '',
    s.address || s.pob || '',
    s.familyStatus || 'ទូទៅ',
    s.note || 'នៅរស់'
  ]);

  const worksheetData = [...headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },  // ល.រ
    { wch: 22 }, // គោត្តនាម នាម
    { wch: 8 },  // ភេទ
    { wch: 14 }, // ថ្ងៃខែឆ្នាំកំណើត
    { wch: 35 }, // ទីកន្លែងកំណើត
    { wch: 18 }, // ឪពុកឈ្មោះ
    { wch: 16 }, // មុខរបរ
    { wch: 18 }, // ម្តាយឈ្មោះ
    { wch: 16 }, // មុខរបរ
    { wch: 35 }, // ទីលំនៅបច្ចុប្បន្ន
    { wch: 14 }, // ស្ថានភាពគ្រួសារ
    { wch: 16 }, // សម្គាល់
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'បញ្ជីរាយនាមសិស្ស');
  XLSX.writeFile(workbook, fileName);
}

/**
 * Downloads official MoEYS sample 39 students as Excel Workbook (.xlsx)
 */
export function exportSampleMoEYSExcelWorkbook(fileName: string = 'moeys_students_template.xlsx') {
  const { students } = parseStudentsCSV(SAMPLE_MOEYS_39_STUDENTS_CSV, 0);
  exportStudentsToExcelWorkbook(
    students,
    fileName,
    'សាលាបឋមសិក្សា ហ៊ុន សែន ស្រែពោធិ៍/អូរឫស្សីកណ្តាល/សៀមបូក/ស្ទឹងត្រែង',
    'ថ្នាក់ទី: 6-A'
  );
}
