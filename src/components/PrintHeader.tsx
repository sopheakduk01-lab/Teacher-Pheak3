import React from 'react';
import { TeacherProfile } from '../types';

interface PrintHeaderProps {
  teacher: TeacherProfile;
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({ teacher }) => {
  return (
    <div className="hidden print:block text-center pb-6 mb-6 border-b-2 border-slate-900 w-full">
      <div className="flex items-start justify-between">
        <div className="text-left space-y-1">
          <p className="font-moul text-xs text-slate-900">ព្រះរាជាណាចក្រកម្ពុជា</p>
          <p className="font-moul text-xs text-slate-900">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
          <div className="pt-2 text-xs font-bold text-slate-800">
            <p>{teacher.school || 'សាលាបឋមសិក្សា'}</p>
            <p>{teacher.grade || 'ថ្នាក់ទី ៦'}</p>
          </div>
        </div>
        <div className="text-right text-xs font-bold text-slate-800 space-y-1">
          <p>ឆ្នាំសិក្សា ៖ {teacher.academicYear || '២០២៥ - ២០២៦'}</p>
          <p>គ្រូបន្ទុកថ្នាក់ ៖ {teacher.name || 'លោកគ្រូ/អ្នកគ្រូ'}</p>
          <p>កាលបរិច្ឆេទ ៖ {new Date().toLocaleDateString('km-KH')}</p>
        </div>
      </div>
    </div>
  );
};
