export interface TimetableRow {
  time?: string;
  duration?: string;
  type?: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  [key: string]: any;
}

export interface TimetableInfo {
  schoolName: string;
  gradeName: string;
  academicYear: string;
  teacherName: string;
  roomName: string;
}

export const morningShiftRows: TimetableRow[] = [
  { time: '07:00 - 07:50', duration: '50 នាទី', type: 'lesson', monday: 'គោរពទង់ជាតិ', tuesday: 'ភាសាខ្មែរ', wednesday: 'គណិតវិទ្យា', thursday: 'ភាសាខ្មែរ', friday: 'គណិតវិទ្យា', saturday: 'កីឡា', mon: 'គោរពទង់ជាតិ', tue: 'ភាសាខ្មែរ', wed: 'គណិតវិទ្យា', thu: 'ភាសាខ្មែរ', fri: 'គណិតវិទ្យា', sat: 'កីឡា' },
  { time: '07:50 - 08:40', duration: '50 នាទី', type: 'lesson', monday: 'ភាសាខ្មែរ', tuesday: 'ភាសាខ្មែរ', wednesday: 'គណិតវិទ្យា', thursday: 'វិទ្យាសាស្ត្រ', friday: 'ភាសាខ្មែរ', saturday: 'កីឡា', mon: 'ភាសាខ្មែរ', tue: 'ភាសាខ្មែរ', wed: 'គណិតវិទ្យា', thu: 'វិទ្យាសាស្ត្រ', fri: 'ភាសាខ្មែរ', sat: 'កីឡា' },
  { time: '08:40 - 09:10', duration: '30 នាទី', type: 'break', monday: 'ចេញលេង', tuesday: 'ចេញលេង', wednesday: 'ចេញលេង', thursday: 'ចេញលេង', friday: 'ចេញលេង', saturday: 'ចេញលេង', mon: 'ចេញលេង', tue: 'ចេញលេង', wed: 'ចេញលេង', thu: 'ចេញលេង', fri: 'ចេញលេង', sat: 'ចេញលេង' },
  { time: '09:10 - 10:00', duration: '50 នាទី', type: 'lesson', monday: 'គណិតវិទ្យា', tuesday: 'វិទ្យាសាស្ត្រ', wednesday: 'សិក្សាសង្គម', thursday: 'គណិតវិទ្យា', friday: 'វិទ្យាសាស្ត្រ', saturday: 'សីលធម៌', mon: 'គណិតវិទ្យា', tue: 'វិទ្យាសាស្ត្រ', wed: 'សិក្សាសង្គម', thu: 'គណិតវិទ្យា', fri: 'វិទ្យាសាស្ត្រ', sat: 'សីលធម៌' },
  { time: '10:00 - 10:50', duration: '50 នាទី', type: 'lesson', monday: 'សិក្សាសង្គម', tuesday: 'សិល្បៈ', wednesday: 'ភាសាអង់គ្លេស', thursday: 'សិក្សាសង្គម', friday: 'ភាសាអង់គ្លេស', saturday: 'សម្អាតថ្នាក់', mon: 'សិក្សាសង្គម', tue: 'សិល្បៈ', wed: 'ភាសាអង់គ្លេស', thu: 'សិក្សាសង្គម', fri: 'ភាសាអង់គ្លេស', sat: 'សម្អាតថ្នាក់' },
];

export const afternoonShiftRows: TimetableRow[] = [
  { time: '13:00 - 13:50', duration: '50 នាទី', type: 'lesson', monday: 'ភាសាខ្មែរ', tuesday: 'ភាសាខ្មែរ', wednesday: 'គណិតវិទ្យា', thursday: 'ភាសាខ្មែរ', friday: 'គណិតវិទ្យា', saturday: 'កីឡា', mon: 'ភាសាខ្មែរ', tue: 'ភាសាខ្មែរ', wed: 'គណិតវិទ្យា', thu: 'ភាសាខ្មែរ', fri: 'គណិតវិទ្យា', sat: 'កីឡា' },
  { time: '13:50 - 14:40', duration: '50 នាទី', type: 'lesson', monday: 'គណិតវិទ្យា', tuesday: 'វិទ្យាសាស្ត្រ', wednesday: 'សិក្សាសង្គម', thursday: 'វិទ្យាសាស្ត្រ', friday: 'ភាសាខ្មែរ', saturday: 'សិល្បៈ', mon: 'គណិតវិទ្យា', tue: 'វិទ្យាសាស្ត្រ', wed: 'សិក្សាសង្គម', thu: 'វិទ្យាសាស្ត្រ', fri: 'ភាសាខ្មែរ', sat: 'សិល្បៈ' },
  { time: '14:40 - 15:10', duration: '30 នាទី', type: 'break', monday: 'ចេញលេង', tuesday: 'ចេញលេង', wednesday: 'ចេញលេង', thursday: 'ចេញលេង', friday: 'ចេញលេង', saturday: 'ចេញលេង', mon: 'ចេញលេង', tue: 'ចេញលេង', wed: 'ចេញលេង', thu: 'ចេញលេង', fri: 'ចេញលេង', sat: 'ចេញលេង' },
  { time: '15:10 - 16:00', duration: '50 នាទី', type: 'lesson', monday: 'សិក្សាសង្គម', tuesday: 'ភាសាអង់គ្លេស', wednesday: 'វិទ្យាសាស្ត្រ', thursday: 'គណិតវិទ្យា', friday: 'សិក្សាសង្គម', saturday: 'សីលធម៌', mon: 'សិក្សាសង្គម', tue: 'ភាសាអង់គ្លេស', wed: 'វិទ្យាសាស្ត្រ', thu: 'គណិតវិទ្យា', fri: 'សិក្សាសង្គម', sat: 'សីលធម៌' },
  { time: '16:00 - 16:50', duration: '50 នាទី', type: 'lesson', monday: 'ភាសាអង់គ្លេស', tuesday: 'កីឡា', wednesday: 'សីលធម៌', thursday: 'សិល្បៈ', friday: 'ភាសាខ្មែរ', saturday: 'សម្អាតថ្នាក់', mon: 'ភាសាអង់គ្លេស', tue: 'កីឡា', wed: 'សីលធម៌', thu: 'សិល្បៈ', fri: 'ភាសាខ្មែរ', sat: 'សម្អាតថ្នាក់' },
];
