import { Student } from '../types';

export const SAMPLE_MOEYS_39_STUDENTS_CSV = `ល.រ,ឈ្មោះសិស្ស,ភេទ,ថ្ងៃខែឆ្នាំកំណើត,អាសយដ្ឋាន
1,សុខ ចិន្តា,ស្រី,12/05/2013,ភ្នំពេញ
2,ចាន់ សុផល,ប្រុស,24/08/2013,កណ្តាល
3,ហេង ពិសី,ស្រី,05/11/2013,ភ្នំពេញ
4,កែវ វិបុល,ប្រុស,19/02/2013,កំពង់ចាម
`;

export function parseStudentsCSV(csvText: string): Partial<Student>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const students: Partial<Student>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map((p) => p.trim());
    if (parts.length >= 2 && parts[1]) {
      students.push({
        name: parts[1],
        gender: (parts[2] === 'ស្រី' ? 'ស្រី' : 'ប្រុស') as 'ប្រុស' | 'ស្រី',
        dob: parts[3] || '',
        address: parts[4] || '',
      });
    }
  }
  return students;
}

export async function parseExcelWorkbookFile(file: File): Promise<Partial<Student>[]> {
  const text = await file.text();
  return parseStudentsCSV(text);
}

export function exportStudentsToExcelWorkbook(students: Student[], fileName = 'students.csv'): void {
  const header = 'ល.រ,អត្តលេខ,ឈ្មោះសិស្ស,ភេទ,ថ្ងៃខែឆ្នាំកំណើត,អាសយដ្ឋាន\n';
  const rows = students
    .map(
      (s, idx) =>
        `${idx + 1},${s.rollNo || ''},${s.name},${s.gender},${s.dob || ''},${s.address || ''}`
    )
    .join('\n');

  const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportSampleMoEYSExcelWorkbook(): void {
  const blob = new Blob(['\ufeff' + SAMPLE_MOEYS_39_STUDENTS_CSV], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'គំរូ_បញ្ចូលបញ្ជីឈ្មោះសិស្ស_MoEYS.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
