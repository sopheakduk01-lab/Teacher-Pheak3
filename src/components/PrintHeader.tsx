import React from 'react';
import { TeacherProfile } from '../types';

interface PrintHeaderProps {
  teacher: TeacherProfile;
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({ teacher }) => {
  const currentDate = new Date().toLocaleDateString('km-KH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="print-header hidden mb-6 font-serif">
      {/* ១ ព្រះរាជាណាចក្រកម្ពុជា នៅលើគេបង្អស់ */}
      <div className="text-center space-y-0.5 mb-3">
        <h2 className="font-moul text-sm sm:text-base font-bold text-slate-950">ព្រះរាជាណាចក្រកម្ពុជា</h2>
        <h3 className="font-moul text-xs sm:text-sm font-bold text-slate-900">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
        <div className="text-xs my-1 tracking-wider font-bold text-slate-800">— ༺ ៚ ༻ —</div>
      </div>

      <div className="flex justify-between items-end border-b-2 border-black pb-3">
        <div className="text-left space-y-0.5 text-xs font-bold text-slate-900">
          <p>ការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលស្រុកសៀមបូក</p>
          <p>សាលារៀន៖ <span>{teacher.school || 'សាលារៀនគំរូ'}</span></p>
          <p>ថ្នាក់ទទួលបន្ទុក៖ <span>{teacher.grade || 'ថ្នាក់ទី ៦'}</span></p>
          <p>គ្រូបន្ទុកថ្នាក់៖ <span>{teacher.name}</span></p>
        </div>
        <div className="text-right text-[11px] font-bold text-slate-700 space-y-0.5">
          <p>ឆ្នាំសិក្សា៖ {teacher.academicYear}</p>
          <p>កាលបរិច្ឆេទ៖ {currentDate}</p>
        </div>
      </div>
    </div>
  );
};
