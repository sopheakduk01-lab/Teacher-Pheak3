import React from 'react';
import {
  MONTH_COLUMNS,
  OfficialCommitteeData,
} from '../../types/committeeTypes';

export type CommitteePrintPageScope =
  | 'all'
  | 'cover'
  | 'chart'
  | 'members'
  | 'mandate'
  | 'minutes'
  | 'annual'
  | 'quarterly'
  | 'monthly';

interface Props {
  data: OfficialCommitteeData;
  isScreenPreview?: boolean;
  printScope?: CommitteePrintPageScope;
}

export const CommitteePrintBooklet: React.FC<Props> = ({
  data,
  isScreenPreview = false,
  printScope = 'all',
}) => {
  const president =
    data.members.find(
      (m) => m.roleTitle.includes('ប្រធាន') && !m.roleTitle.includes('អនុ') && !m.roleTitle.includes('ថ្នាក់')
    ) || data.members[0];
  const vp1 = data.members.find((m) => m.roleTitle.includes('អនុប្រធានទី១') || m.id === 'mem_2') || data.members[1];
  const vp2 = data.members.find((m) => m.roleTitle.includes('អនុប្រធានទី២') || m.id === 'mem_3') || data.members[2];
  const teacherMember = data.members.find((m) => m.category === 'teacher' || m.id === 'mem_4') || data.members[3];
  const otherMembers = data.members.filter(
    (m) =>
      m.category === 'student' ||
      (m.roleTitle.includes('សមាជិក') &&
        m.id !== president?.id &&
        m.id !== vp1?.id &&
        m.id !== vp2?.id &&
        m.id !== teacherMember?.id)
  );

  const mandateReferences = data.mandateReferences?.length
    ? data.mandateReferences
    : [
        'សេចក្តីណែនាំលេខ ៥៤ អយក.សណន ចុះថ្ងៃទី១៧ ខែតុលា ឆ្នាំ២០២៤ របស់ក្រសួងអប់រំ យុវជន និងកីឡា។',
        `ស្មារតីអង្គប្រជុំចុះ${data.meetingDateKhmer} ត្រូវនឹង${data.meetingDateSolar} ស្តីពីការបោះឆ្នោតជ្រើសរើសគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន (គ. គ. ថ.)។`,
      ];

  const mandateDuties = data.mandateDuties?.length
    ? data.mandateDuties
    : [
        'កំណត់តម្រូវការ និងបញ្ហាប្រឈមទាក់ទងនឹងការរៀននិងបង្រៀនក្នុងថ្នាក់',
        'កសាងផែនការអភិវឌ្ឍថ្នាក់រៀន ផែនការបង្រៀន និងផែនការសិស្សរៀន',
        'កៀរគរធនធានសម្ភារៈនិងថវិកា ពីមាតាបិតាអ្នកអាណាព្យាបាល សប្បុរសជនដើម្បីអភិវឌ្ឍថ្នាក់រៀន និងបង្រៀន',
        'ផ្តើមគំនិតក្នុងការកែលម្អថ្នាក់រៀន និងជួយផលិតសម្ភារៈរៀននិងបង្រៀន',
        'ចូលរួមរៀបចំនិងសង្កេតមើលដំណើរការតេស្តសិស្ស ប្រចាំខែ ឆមាស ឆ្នាំ',
        'សហការជាមួយគ្រូបន្ទុកថ្នាក់ជួយអប់រំមាតាបិតាជួយជំរុញកូនឱ្យមកសាលារៀននិងបង្រៀនបន្ថែម',
        'ដោះស្រាយបញ្ហាទាក់ទងនឹងការរៀននិងបង្រៀន ជាពិសេសកុមារជួបការលំបាក',
        'តាមដាននិងផ្តល់ព័ត៌មានត្រឡប់ចំពោះការរៀននិងបង្រៀន ការធ្វើតេស្តសិស្សនិងលទ្ធផលនៃការសិក្សា',
        'បែងចែកវេនប្រចាំការនៅថ្នាក់រៀនដើម្បីពិនិត្យមើលអំពីដំណើរការរៀនរបស់កូនៗ',
      ];

  const meetingAgendas = data.meetingAgendas?.length
    ? data.meetingAgendas
    : [
        'ចុះវត្តមានសមាសភាពចូលរួម',
        'មតិសំណេះសំណាលជាមួយលោកគ្រូអ្នកគ្រូ និងមាតាបិតា អ្នកអាណាព្យាបាលសិស្ស',
        'ការបង្ហាញពីគោលបំណងនៃការបង្កើតគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន',
        'ការបង្ហាញពីសមាសភាពដែលអាចឈរឈ្មោះបោះឆ្នោត គ. គ. ថ. និងរចនាសម្ព័ន្ធ តួនាទី គ. គ. ថ.',
        'ការបោះឆ្នោតជ្រើសរើស គ. គ. ថ. ដោយសម្ងាត់ និងស្ម័គ្រចិត្ត',
        'ផែនការបន្ត និងការប្តេជ្ញាចិត្តរួមគ្នា',
      ];

  const shouldRenderPage = (pageKey: CommitteePrintPageScope) => {
    return printScope === 'all' || printScope === pageKey;
  };

  // Base CSS classes for standard A4 page container
  const getPageClass = (isLast: boolean = false) => {
    if (isScreenPreview) {
      return 'w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white text-slate-900 font-serif p-6 sm:p-10 shadow-2xl border border-slate-300 rounded-3xl my-6 relative overflow-hidden flex flex-col justify-between';
    }
    return `booklet-page bg-white text-slate-900 font-serif ${isLast ? 'booklet-page-last' : ''}`;
  };

  const containerId = isScreenPreview ? 'official-committee-preview-content' : 'official-committee-print-content';

  return (
    <div
      id={containerId}
      className={
        isScreenPreview
          ? 'space-y-8 py-4'
          : 'print-booklet-container hidden print:block bg-white text-slate-900 font-serif leading-relaxed'
      }
    >
      <style>{`
        @media print {
          @page {
            size: A4 portrait !important;
            margin: 8mm 10mm 8mm 10mm !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: 100% !important;
            max-height: none !important;
            overflow: visible !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            font-size: 9pt !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-booklet-container {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          .booklet-page {
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: 190mm !important;
            height: 268mm !important;
            max-height: 268mm !important;
            min-height: 268mm !important;
            padding: 2mm 3mm !important;
            margin: 0 auto !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .booklet-page-last {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .no-print {
            display: none !important;
          }
          .booklet-page * {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* =========================================================
          PAGE 1: COVER PAGE (ទំព័រគម្របផ្លូវការ)
          ========================================================= */}
      {shouldRenderPage('cover') && (
        <div className={getPageClass(printScope === 'cover')}>
          {/* Double Traditional Border Frame */}
          <div className="border-4 border-double border-amber-600/90 dark:border-amber-600 rounded-2xl p-5 sm:p-7 flex flex-col justify-between h-full flex-1 text-center relative bg-gradient-to-b from-amber-50/20 via-white to-amber-50/30">
          
          {/* Top National Header */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black font-moul text-amber-800">
              ព្រះរាជាណាចក្រកម្ពុជា
            </h2>
            <h3 className="text-sm sm:text-base font-bold font-moul text-slate-900 tracking-wide">
              ជាតិ សាសនា ព្រះមហាក្សត្រ
            </h3>
            <div className="w-28 h-0.5 bg-amber-600 mx-auto mt-2" />
          </div>

          {/* School / Ministry Header */}
          <div className="space-y-1.5 py-4">
            <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase">
              រដ្ឋបាល{data.districtName} • {data.provinceName}
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-700">
              ការិយាល័យអប់រំ យុវជន និងកីឡា
            </p>
            <h1 className="text-xl sm:text-2xl font-black font-moul text-blue-900 pt-1">
              {data.schoolName}
            </h1>
          </div>

          {/* Center Main Book Title Banner */}
          <div className="my-auto py-6 space-y-4">
            <div className="inline-block border-y-4 border-amber-600 py-4 px-6 sm:px-12 bg-white/80 shadow-xs rounded-xl">
              <span className="text-xs font-bold text-amber-800 tracking-widest uppercase block mb-1">
                ឯកសាររដ្ឋបាល និងផែនការសកម្មភាព
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-moul text-red-700 leading-snug">
                គណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន
              </h2>
              <p className="text-xl sm:text-2xl font-black font-moul text-slate-900 mt-2">
                ( គ. គ. ថ. )
              </p>
            </div>

            <div className="space-y-1 pt-2">
              <p className="text-lg sm:text-xl font-black font-moul text-slate-800">
                {data.gradeName}
              </p>
              <p className="text-sm sm:text-base font-bold text-slate-700">
                ឆ្នាំសិក្សា {data.academicYear}
              </p>
            </div>

            {/* Optional Cover Photo */}
            {data.coverPhotoUrl && (
              <div className="w-48 h-32 mx-auto rounded-xl overflow-hidden border-2 border-amber-500 shadow-md">
                <img src={data.coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}

            {/* 7 Sections Index Outline Box */}
            <div className="max-w-md mx-auto text-left bg-slate-50/90 border border-amber-200/80 rounded-xl p-3.5 text-[11px] text-slate-700 space-y-1 font-sans">
              <span className="font-moul text-[10px] text-amber-800 block text-center border-b border-amber-200 pb-1 mb-1">
                មាតិកាឯកសារ ៧ ផ្នែកផ្លូវការ ៖
              </span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 font-medium">
                <span>១. រចនាសម្ព័ន្ធ (គំនូសបំព្រួញ)</span>
                <span>២. បំណែងចែកភារកិច្ច & រូបថត</span>
                <span>៣. លិខិតបង្គាប់ការផ្លូវការ</span>
                <span>៤. កំណត់ហេតុប្រជុំបោះឆ្នោត</span>
                <span>៥. ផែនការសកម្មភាពប្រចាំឆ្នាំ</span>
                <span>៦. ផែនការប្រចាំត្រីមាស</span>
                <span className="col-span-2">៧. ផែនការប្រចាំខែ</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="border-t border-slate-300 pt-3 text-xs font-bold text-slate-700 flex justify-between items-end">
            <div className="text-left space-y-0.5">
              <p>គ្រូបន្ទុកថ្នាក់ ៖ <span className="font-moul text-slate-900">{data.teacherName}</span></p>
              <p>នាយកសាលា ៖ <span className="font-moul text-slate-900">{data.principalName}</span></p>
            </div>
            <div className="text-right text-[11px] text-slate-600">
              <p>កាលបរិច្ឆេទ ៖ {data.mandateDateSolar}</p>
              <p className="text-[10px] text-amber-800 font-bold">MoEYS Guidelines No. 54</p>
            </div>
          </div>

          {/* Cover Page Footer indicator */}
          <div className="border-t border-slate-300 pt-2 text-[10px] text-slate-500 flex justify-between items-center">
            <span>ឯកសាររដ្ឋបាលផ្លូវការ គ. គ. ថ. • {data.schoolName}</span>
            <span className="font-bold text-slate-700">ទំព័រគម្រប (១/៨)</span>
          </div>

        </div>
      </div>
      )}

      {/* =========================================================
          PAGE 2: SECTION 1 - ORGANIZATIONAL CHART
          ========================================================= */}
      {shouldRenderPage('chart') && (
      <div className={getPageClass(printScope === 'chart')}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-amber-600 pb-2.5">
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase">ផ្នែកទី ១ • គណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន (គ. គ. ថ.)</span>
              <h2 className="text-base sm:text-lg font-black font-moul text-slate-900">
                ១. រចនាសម្ព័ន្ធ (គំនូសបំព្រួញ)
              </h2>
            </div>
            <div className="text-right text-xs font-bold text-slate-600">
              <p>{data.schoolName}</p>
              <p>{data.gradeName} • ឆ្នាំសិក្សា {data.academicYear}</p>
            </div>
          </div>

          {/* Intro Description */}
          <div className="text-xs text-slate-800 leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-200">
            <p className="font-bold font-moul text-[10.5px] text-amber-900 mb-0.5">
              សេចក្តីផ្តើម និងនិយមន័យរចនាសម្ព័ន្ធ ៖
            </p>
            <p className="font-serif text-[10.5px] leading-relaxed">{data.introDescription}</p>
          </div>

          {/* Hierarchical Tree Diagram (A4 Optimized) */}
          <div className="flex flex-col items-center space-y-2.5 py-1">
            
            {/* President */}
            {president && (
              <div className="flex flex-col items-center">
                <div className="border-2 border-red-600 bg-red-50/70 rounded-xl p-2.5 text-center w-72 shadow-xs">
                  <span className="px-3 py-0.5 rounded-full bg-red-600 text-white font-moul text-[9.5px] font-bold inline-block mb-1">
                    {president.roleTitle}
                  </span>
                  <h3 className="font-bold text-xs font-moul text-slate-900">{president.name}</h3>
                  <p className="text-[9.5px] text-slate-600">{president.representation}</p>
                  <p className="text-[9.5px] text-red-900 font-medium mt-1 bg-white/80 p-1 rounded border border-red-200">
                    {president.dutySummary}
                  </p>
                </div>
                <div className="w-0.5 h-3 bg-amber-500" />
              </div>
            )}

            {/* Level 2: VP1, Teacher, VP2 */}
            <div className="w-full">
              <div className="grid grid-cols-3 gap-2 w-full">
                {vp1 && (
                  <div className="border-2 border-red-400 bg-white rounded-xl p-2 text-center flex flex-col justify-between">
                    <div>
                      <span className="font-moul text-[9.5px] text-red-700 block mb-0.5">{vp1.roleTitle}</span>
                      <h4 className="font-bold text-xs font-moul text-slate-900">{vp1.name}</h4>
                      <p className="text-[8.5px] text-slate-500">{vp1.representation}</p>
                    </div>
                    <span className="text-[8.5px] text-red-800 bg-red-50 p-1 rounded mt-1 border border-red-100">
                      {vp1.dutySummary}
                    </span>
                  </div>
                )}

                {teacherMember && (
                  <div className="border-2 border-blue-600 bg-blue-50/60 rounded-xl p-2 text-center flex flex-col justify-between">
                    <div>
                      <span className="font-moul text-[9.5px] text-blue-800 block mb-0.5">{teacherMember.roleTitle}</span>
                      <h4 className="font-bold text-xs font-moul text-slate-900">{teacherMember.name}</h4>
                      <p className="text-[8.5px] text-blue-700 font-bold">{teacherMember.representation}</p>
                    </div>
                    <span className="text-[8.5px] text-blue-900 bg-white p-1 rounded mt-1 border border-blue-200 font-medium">
                      {teacherMember.dutySummary}
                    </span>
                  </div>
                )}

                {vp2 && (
                  <div className="border-2 border-red-400 bg-white rounded-xl p-2 text-center flex flex-col justify-between">
                    <div>
                      <span className="font-moul text-[9.5px] text-red-700 block mb-0.5">{vp2.roleTitle}</span>
                      <h4 className="font-bold text-xs font-moul text-slate-900">{vp2.name}</h4>
                      <p className="text-[8.5px] text-slate-500">{vp2.representation}</p>
                    </div>
                    <span className="text-[8.5px] text-red-800 bg-red-50 p-1 rounded mt-1 border border-red-100">
                      {vp2.dutySummary}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Level 3: Members */}
            <div className="w-full pt-1">
              <div className="text-center mb-1.5">
                <span className="font-moul text-[10.5px] text-slate-800 bg-slate-100 px-3.5 py-0.5 rounded-full border border-slate-300">
                  សមាជិក គណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {otherMembers.map((m, idx) => (
                  <div key={m.id} className="border border-slate-300 rounded-lg p-1.5 text-xs bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <span className="font-bold font-moul text-[10px] text-slate-900">
                        {idx + 1}. {m.name} <span className="text-red-700">({m.roleTitle})</span>
                      </span>
                      <p className="text-[8.5px] text-slate-500">{m.representation}</p>
                    </div>
                    <p className="text-[8.5px] text-slate-700 mt-0.5 bg-white p-0.5 rounded border border-slate-200">
                      {m.dutySummary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Official Signatures Block */}
        <div className="pt-2">
          <div className="flex justify-between items-end text-xs text-center font-bold">
            <div className="space-y-6">
              <p className="font-moul text-[10.5px]">បានឃើញ និងឯកភាព<br/>នាយកសាលា</p>
              <p className="font-moul text-xs text-slate-900">{data.principalName}</p>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[9.5px]">{data.mandateDateKhmer}</p>
                <p className="text-[9.5px]">{data.mandateDateSolar}</p>
                <p className="font-moul text-[10.5px] mt-0.5">គ្រូបន្ទុកថ្នាក់</p>
              </div>
              <p className="font-moul text-xs text-slate-900">{data.teacherName}</p>
            </div>
          </div>
          <div className="border-t border-slate-300 pt-1.5 mt-2 text-[10px] text-slate-500 flex justify-between items-center">
            <span>ឯកសារផ្លូវការ គ. គ. ថ. • {data.schoolName}</span>
            <span className="font-bold text-slate-700">ទំព័រទី ២/៨</span>
          </div>
        </div>
      </div>
      )}

      {/* =========================================================
          PAGE 3: SECTION 2 - DUTY DISTRIBUTION & PHOTOS
          ========================================================= */}
      {shouldRenderPage('members') && (
      <div className={getPageClass(printScope === 'members')}>
        <div className="space-y-3.5">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-amber-600 pb-2.5">
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase">ផ្នែកទី ២ • គណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន (គ. គ. ថ.)</span>
              <h2 className="text-base sm:text-lg font-black font-moul text-slate-900">
                ២. បំណែងចែកភារកិច្ច & រូបថតសមាជិក
              </h2>
            </div>
            <div className="text-right text-xs font-bold text-slate-600">
              <p>{data.schoolName}</p>
              <p>{data.gradeName}</p>
            </div>
          </div>

          {/* Members Cards Grid with Photos */}
          <div className="grid grid-cols-2 gap-2">
            {data.members.map((member, idx) => (
              <div
                key={member.id}
                className="border border-slate-300 rounded-xl p-2 text-xs bg-white space-y-1 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-12 rounded-lg bg-slate-100 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg">
                        {member.category === 'teacher' ? '👨‍🏫' : member.category === 'student' ? '👧' : '👤'}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-red-700 font-bold font-moul text-[9.5px] block">
                      {idx + 1}- {member.roleTitle}
                    </span>
                    <h4 className="font-bold font-moul text-[10.5px] text-slate-900 truncate">
                      {member.name}
                    </h4>
                    <p className="text-[8.5px] text-slate-500 truncate">{member.representation}</p>
                    {member.votesCount !== undefined && member.votesCount > 0 && (
                      <span className="text-[7.5px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-bold">
                        🗳️ {member.votesCount} សំឡេង
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-amber-50/60 p-1 rounded border border-amber-200/60 text-[8.5px] text-slate-800">
                  <strong className="text-amber-900">ភារកិច្ច ៖</strong> {member.dutySummary}
                </div>

                {member.dutyDetails && member.dutyDetails.length > 0 && (
                  <ul className="list-disc pl-3.5 space-y-0.2 text-[8px] text-slate-700">
                    {member.dutyDetails.slice(0, 2).map((d, dIdx) => (
                      <li key={dIdx} className="leading-tight">{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Official Signatures Block */}
        <div className="pt-2">
          <div className="flex justify-between items-end text-xs text-center font-bold">
            <div className="space-y-6">
              <p className="font-moul text-[10.5px]">បានឃើញ និងឯកភាព<br/>នាយកសាលា</p>
              <p className="font-moul text-xs text-slate-900">{data.principalName}</p>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[9.5px]">{data.mandateDateKhmer}</p>
                <p className="text-[9.5px]">{data.mandateDateSolar}</p>
                <p className="font-moul text-[10.5px] mt-0.5">គ្រូបន្ទុកថ្នាក់</p>
              </div>
              <p className="font-moul text-xs text-slate-900">{data.teacherName}</p>
            </div>
          </div>
          <div className="border-t border-slate-300 pt-1.5 mt-2 text-[10px] text-slate-500 flex justify-between items-center">
            <span>ឯកសារផ្លូវការ គ. គ. ថ. • {data.schoolName}</span>
            <span className="font-bold text-slate-700">ទំព័រទី ៣/៨</span>
          </div>
        </div>
      </div>
      )}

      {/* =========================================================
          PAGE 4: SECTION 3 - OFFICIAL MANDATE LETTER
          ========================================================= */}
      {shouldRenderPage('mandate') && (
      <div className={getPageClass(printScope === 'mandate')}>
        <div className="space-y-2">
          {/* National Emblem & Slogan */}
          <div className="text-center space-y-0.5">
            <h3 className="font-moul text-sm text-amber-800">ព្រះរាជាណាចក្រកម្ពុជា</h3>
            <h4 className="font-moul text-xs text-slate-900">ជាតិ សាសនា ព្រះមហាក្សត្រ</h4>
            <div className="w-20 h-0.5 bg-amber-600 mx-auto mt-0.5" />
          </div>

          {/* Administration Header */}
          <div className="flex justify-between items-start text-xs font-bold text-slate-700 border-b border-slate-200 pb-1.5">
            <div>
              <p>រដ្ឋបាល{data.districtName}</p>
              <p>ការិយាល័យអប់រំ យុវជន និងកីឡា</p>
              <p className="font-moul text-slate-900">{data.schoolName}</p>
            </div>
            <div className="text-right text-[10px]">
              <p>លេខ៖ .................... អយក</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-0.5">
            <h2 className="text-sm sm:text-base font-black font-moul text-slate-900">
              ៣. លិខិតបង្គាប់ការផ្លូវការ
            </h2>
            <p className="text-[11px] font-bold italic text-slate-700">
              ស្តីពីការចាត់តាំងគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន {data.gradeName} ឆ្នាំសិក្សា {data.academicYear}
            </p>
          </div>

          {/* References */}
          <div className="text-xs space-y-0.5 leading-snug bg-slate-50 p-2 rounded-lg border border-slate-200 text-[9.5px]">
            <p className="font-bold">យោង ៖ {mandateReferences[0]}</p>
            {mandateReferences.slice(1).map((r, rIdx) => (
              <p key={rIdx} className="pl-4 text-[9px]">- {r}</p>
            ))}
          </div>

          {/* Section I: Members */}
          <div className="space-y-1 text-xs">
            <h4 className="font-moul text-[11px] text-amber-800 border-b border-amber-400 pb-0.5">
              I. សមាសភាពគណៈកម្មការ
            </h4>
            <div className="grid grid-cols-2 gap-1 text-[9.5px]">
              {data.members.map((m, idx) => (
                <div key={m.id} className="p-0.5 border-b border-slate-200 flex justify-between">
                  <span>{idx + 1}. <strong className="font-moul">{m.name}</strong> ({m.roleTitle})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section II: Mandate Duties */}
          <div className="space-y-1 text-xs">
            <h4 className="font-moul text-[11px] text-amber-800 border-b border-amber-400 pb-0.5">
              II. តួនាទី និងភារកិច្ច ({mandateDuties.length} ចំណុច)
            </h4>
            <ul className="list-disc pl-5 space-y-0.5 text-[9px] text-slate-800 leading-tight">
              {mandateDuties.map((d, dIdx) => (
                <li key={dIdx}>{d}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-2">
          <p className="text-[9.5px] font-bold text-center italic text-slate-600 mb-2">
            លិខិតបង្គាប់ការនេះមានប្រសិទ្ធភាពចាប់ពីថ្ងៃចុះហត្ថលេខាតទៅ។
          </p>
          <div className="flex justify-between items-end text-xs text-center font-bold">
            <div className="space-y-6">
              <p className="font-moul text-[10.5px]">បានឃើញ និងឯកភាព<br/>នាយកសាលា</p>
              <p className="font-moul text-xs text-slate-900">{data.principalName}</p>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[9.5px]">{data.mandateDateKhmer}</p>
                <p className="text-[9.5px]">{data.mandateDateSolar}</p>
                <p className="font-moul text-[10.5px] mt-0.5">គ្រូបន្ទុកថ្នាក់</p>
              </div>
              <p className="font-moul text-xs text-slate-900">{data.teacherName}</p>
            </div>
          </div>
          <div className="border-t border-slate-300 pt-1.5 mt-2 text-[10px] text-slate-500 flex justify-between items-center">
            <span>ឯកសារផ្លូវការ គ. គ. ថ. • {data.schoolName}</span>
            <span className="font-bold text-slate-700">ទំព័រទី ៤/៨</span>
          </div>
        </div>
      </div>
      )}

      {/* =========================================================
          PAGE 5: SECTION 4 - ELECTION MINUTES
          ========================================================= */}
      {shouldRenderPage('minutes') && (
      <div className={getPageClass(printScope === 'minutes')}>
        <div className="space-y-2">
          {/* National Emblem & Slogan */}
          <div className="text-center space-y-0.5">
            <h3 className="font-moul text-sm text-amber-800">ព្រះរាជាណាចក្រកម្ពុជា</h3>
            <h4 className="font-moul text-xs text-slate-900">ជាតិ សាសនា ព្រះមហាក្សត្រ</h4>
            <div className="w-20 h-0.5 bg-amber-600 mx-auto mt-0.5" />
          </div>

          {/* Title */}
          <div className="text-center space-y-0.5">
            <h2 className="text-sm sm:text-base font-black font-moul text-slate-900">
              ៤. កំណត់ហេតុប្រជុំបោះឆ្នោតជ្រើសរើស គ. គ. ថ.
            </h2>
            <p className="text-[11px] font-bold italic text-slate-700">
              {data.schoolName} • {data.gradeName} ឆ្នាំសិក្សា {data.academicYear}
            </p>
          </div>

          {/* Opening Details & Agendas */}
          <div className="text-xs space-y-1.5 leading-snug bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[10px]">
            <p>
              នៅ<strong>{data.meetingDateKhmer}</strong> ត្រូវនឹង<strong>{data.meetingDateSolar}</strong> {data.meetingTime || 'វេលាម៉ោង ៧:៣០ នាទីព្រឹក'} បានដំណើរការប្រជុំនៅ<strong>{data.meetingLocation || data.schoolName}</strong> ដឹកនាំដោយលោក <strong>{data.principalName}</strong>។
            </p>

            <h4 className="font-bold text-amber-800 font-moul text-[10px]">➤ របៀបវារៈនៃអង្គប្រជុំ ({meetingAgendas.length} ចំណុច) ៖</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[9px]">
              {meetingAgendas.map((ag, idx) => (
                <div key={idx} className="flex items-start gap-1">
                  <span className="font-bold">{idx + 1}.</span>
                  <span>{ag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Attendees */}
          <div className="space-y-0.5 text-xs">
            <h4 className="font-bold text-amber-800 font-moul text-[10px]">➤ សមាសភាពចូលរួម ៖</h4>
            <p className="text-slate-800 bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-[9px]">
              {data.meetingAttendeesSummary || `១. លោក ${data.principalName} នាយកសាលា | ២. លោក ${data.vicePrincipalName} នាយករង | ៣. លោកគ្រូអ្នកគ្រូ | ៤. សិស្សានុសិស្ស | ៥. អាណាព្យាបាលសិស្សទាំងអស់`}
            </p>
          </div>

          {/* Section: Election Votes Table */}
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-amber-800 font-moul text-[10px]">➤ លទ្ធផលបោះឆ្នោតជាសម្ងាត់ និងស្ម័គ្រចិត្ត ៖</h4>
            <table className="w-full text-[9px] border border-slate-300">
              <thead className="bg-slate-100 font-bold text-slate-900">
                <tr>
                  <th className="p-1 border border-slate-300 text-center w-7">ល.រ</th>
                  <th className="p-1 border border-slate-300">ឈ្មោះបេក្ខជន</th>
                  <th className="p-1 border border-slate-300">តួនាទីជាប់ឆ្នោត</th>
                  <th className="p-1 border border-slate-300">ការតំណាង</th>
                  <th className="p-1 border border-slate-300 text-center w-20">សំឡេងឆ្នោត</th>
                </tr>
              </thead>
              <tbody>
                {data.members.map((m, idx) => (
                  <tr key={m.id}>
                    <td className="p-1 border border-slate-300 text-center font-bold">{idx + 1}</td>
                    <td className="p-1 border border-slate-300 font-moul font-bold">{m.name}</td>
                    <td className="p-1 border border-slate-300 text-red-700 font-bold">{m.roleTitle}</td>
                    <td className="p-1 border border-slate-300 text-slate-600">{m.representation}</td>
                    <td className="p-1 border border-slate-300 text-center font-bold text-amber-900 bg-amber-50/50">
                      {m.votesCount !== undefined ? `${m.votesCount} សំឡេង` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-2">
          <div className="flex justify-between items-end text-xs text-center font-bold">
            <div className="space-y-6">
              <p className="font-moul text-[10.5px]">បានឃើញ និងឯកភាព<br/>នាយកសាលា</p>
              <p className="font-moul text-xs text-slate-900">{data.principalName}</p>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[9.5px]">{data.mandateDateKhmer}</p>
                <p className="text-[9.5px]">{data.mandateDateSolar}</p>
                <p className="font-moul text-[10.5px] mt-0.5">គ្រូបន្ទុកថ្នាក់ / អ្នកធ្វើកំណត់ហេតុ</p>
              </div>
              <p className="font-moul text-xs text-slate-900">{data.teacherName || data.recorderName}</p>
            </div>
          </div>
          <div className="border-t border-slate-300 pt-1.5 mt-2 text-[10px] text-slate-500 flex justify-between items-center">
            <span>ឯកសារផ្លូវការ គ. គ. ថ. • {data.schoolName}</span>
            <span className="font-bold text-slate-700">ទំព័រទី ៥/៨</span>
          </div>
        </div>
      </div>
      )}

      {/* =========================================================
          PAGE 6: SECTION 5 - ANNUAL ACTION PLAN
          ========================================================= */}
      {shouldRenderPage('annual') && (
      <div className={getPageClass(printScope === 'annual')}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-amber-600 pb-2.5">
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase">ផ្នែកទី ៥ • គណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន (គ. គ. ថ.)</span>
              <h2 className="text-base sm:text-lg font-black font-moul text-slate-900">
                ៥. ផែនការសកម្មភាពប្រចាំឆ្នាំ (Annual Action Plan)
              </h2>
            </div>
            <div className="text-right text-xs font-bold text-slate-600">
              <p>{data.schoolName}</p>
              <p>{data.gradeName} • ឆ្នាំសិក្សា {data.academicYear}</p>
            </div>
          </div>

          {/* 10-Month Annual Plan Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[9.5px] border border-slate-300">
              <thead className="bg-slate-100 font-bold text-slate-900">
                <tr>
                  <th className="p-1.5 border border-slate-300 text-center w-7">ល.រ</th>
                  <th className="p-1.5 border border-slate-300 min-w-[200px]">សកម្មភាពការងារប្រចាំឆ្នាំ</th>
                  {MONTH_COLUMNS.map((col) => (
                    <th key={col.key} className="p-1 border border-slate-300 text-center w-8">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.annualActivities.map((act, idx) => (
                  <tr key={act.id} className="hover:bg-slate-50">
                    <td className="p-1.5 border border-slate-300 text-center font-bold">{idx + 1}</td>
                    <td className="p-1.5 border border-slate-300 font-medium text-slate-900">{act.title}</td>
                    {MONTH_COLUMNS.map((col) => (
                      <td key={col.key} className="p-1 border border-slate-300 text-center font-black text-amber-800 text-xs">
                        {act.months[col.key] ? '✔' : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Signatures with Principal, Committee President, and Teacher */}
        <div className="pt-2">
          <div className="flex justify-between items-end text-xs text-center font-bold">
            <div className="space-y-6">
              <p className="font-moul text-[10.5px]">បានឃើញ និងឯកភាព<br/>នាយកសាលា</p>
              <p className="font-moul text-xs text-slate-900">{data.principalName}</p>
            </div>
            <div className="space-y-6">
              <p className="font-moul text-[10.5px]">ប្រធាន គ. គ. ថ.</p>
              <p className="font-moul text-xs text-slate-900">{president?.name || 'ប្រធានគណៈកម្មការ'}</p>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[9.5px]">{data.mandateDateSolar}</p>
                <p className="font-moul text-[10.5px] mt-0.5">គ្រូបន្ទុកថ្នាក់</p>
              </div>
              <p className="font-moul text-xs text-slate-900">{data.teacherName}</p>
            </div>
          </div>
          <div className="border-t border-slate-300 pt-1.5 mt-2 text-[10px] text-slate-500 flex justify-between items-center">
            <span>ឯកសារផ្លូវការ គ. គ. ថ. • {data.schoolName}</span>
            <span className="font-bold text-slate-700">ទំព័រទី ៦/៨</span>
          </div>
        </div>
      </div>
      )}

      {/* =========================================================
          PAGE 7: SECTION 6 - QUARTERLY ACTION PLAN (ទំព័រទី ៧/៨)
          ========================================================= */}
      {shouldRenderPage('quarterly') && (
      <div className={getPageClass(printScope === 'quarterly')}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-amber-600 pb-2">
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase">ផ្នែកទី ៦ • គណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន (គ. គ. ថ.)</span>
              <h2 className="text-base sm:text-lg font-black font-moul text-slate-900">
                ៦. ផែនការសកម្មភាពប្រចាំត្រីមាស (Quarterly Action Plan)
              </h2>
            </div>
            <div className="text-right text-xs font-bold text-slate-600">
              <p>{data.schoolName}</p>
              <p>{data.gradeName} • ឆ្នាំសិក្សា {data.academicYear}</p>
            </div>
          </div>

          {/* Strategic Overview Card for 4 Quarters */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg border border-amber-300 bg-amber-50/70 space-y-0.5">
              <span className="font-moul text-[10px] text-amber-900 block">ត្រីមាសទី១</span>
              <span className="text-[9px] text-amber-800 font-bold block">(វិច្ឆិកា - មករា)</span>
              <p className="text-[8.5px] text-slate-700 leading-tight">បោះឆ្នោត គ. គ. ថ., រៀបចំថ្នាក់រៀន, តាមដានវត្តមាន</p>
            </div>
            <div className="p-2 rounded-lg border border-blue-300 bg-blue-50/70 space-y-0.5">
              <span className="font-moul text-[10px] text-blue-900 block">ត្រីមាសទី២</span>
              <span className="text-[9px] text-blue-800 font-bold block">(កុម្ភៈ - មេសា)</span>
              <p className="text-[8.5px] text-slate-700 leading-tight">គាំទ្រការរៀន, ជួយសិស្សរៀនយឺត, ប្រឡងឆមាសទី១</p>
            </div>
            <div className="p-2 rounded-lg border border-emerald-300 bg-emerald-50/70 space-y-0.5">
              <span className="font-moul text-[10px] text-emerald-900 block">ត្រីមាសទី៣</span>
              <span className="text-[9px] text-emerald-800 font-bold block">(ឧសភា - មិថុនា)</span>
              <p className="text-[8.5px] text-slate-700 leading-tight">វាយតម្លៃពាក់កណ្តាលឆ្នាំ, យុទ្ធនាការបរិស្ថាន</p>
            </div>
            <div className="p-2 rounded-lg border border-purple-300 bg-purple-50/70 space-y-0.5">
              <span className="font-moul text-[10px] text-purple-900 block">ត្រីមាសទី៤</span>
              <span className="text-[9px] text-purple-800 font-bold block">(កក្កដា - សីហា)</span>
              <p className="text-[8.5px] text-slate-700 leading-tight">ប្រឡងឆមាសទី២, បូកសរុប និងលើកទឹកចិត្ត</p>
            </div>
          </div>

          {/* Quarterly Plan Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[9px] border border-slate-300">
              <thead className="bg-slate-100 font-bold text-slate-900">
                <tr>
                  <th className="p-1.5 border border-slate-300 text-center w-7">ល.រ</th>
                  <th className="p-1.5 border border-slate-300 min-w-[200px]">សកម្មភាពការងារប្រចាំត្រីមាស</th>
                  {MONTH_COLUMNS.map((col) => (
                    <th key={col.key} className="p-1 border border-slate-300 text-center w-8">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.quarterlyActivities.map((act, idx) => (
                  <tr key={act.id} className="hover:bg-slate-50">
                    <td className="p-1.5 border border-slate-300 text-center font-bold">{idx + 1}</td>
                    <td className="p-1.5 border border-slate-300 font-medium text-slate-900">{act.title}</td>
                    {MONTH_COLUMNS.map((col) => (
                      <td key={col.key} className="p-1 border border-slate-300 text-center font-black text-amber-800 text-xs">
                        {act.months[col.key] ? '✔' : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Signatures with Principal, Committee President, and Teacher */}
        <div className="pt-2">
          <div className="flex justify-between items-end text-xs text-center font-bold">
            <div className="space-y-6">
              <p className="font-moul text-[10.5px]">បានឃើញ និងឯកភាព<br/>នាយកសាលា</p>
              <p className="font-moul text-xs text-slate-900">{data.principalName}</p>
            </div>
            <div className="space-y-6">
              <p className="font-moul text-[10.5px]">ប្រធាន គ. គ. ថ.</p>
              <p className="font-moul text-xs text-slate-900">{president?.name || 'ប្រធានគណៈកម្មការ'}</p>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[9.5px]">{data.mandateDateSolar}</p>
                <p className="font-moul text-[10.5px] mt-0.5">គ្រូបន្ទុកថ្នាក់</p>
              </div>
              <p className="font-moul text-xs text-slate-900">{data.teacherName}</p>
            </div>
          </div>
          <div className="border-t border-slate-300 pt-1.5 mt-2 text-[10px] text-slate-500 flex justify-between items-center">
            <span>ឯកសារផ្លូវការ គ. គ. ថ. • {data.schoolName}</span>
            <span className="font-bold text-slate-700">ទំព័រទី ៧/៨</span>
          </div>
        </div>
      </div>
      )}

      {/* =========================================================
          PAGE 8: SECTION 7 - MONTHLY ACTION PLAN (ទំព័រទី ៨/៨)
          ========================================================= */}
      {shouldRenderPage('monthly') && (
      <div className={getPageClass(true)}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-amber-600 pb-2">
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase">ផ្នែកទី ៧ • គណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន (គ. គ. ថ.)</span>
              <h2 className="text-base sm:text-lg font-black font-moul text-slate-900">
                ៧. ផែនការសកម្មភាពប្រចាំខែ (Monthly Action Plan)
              </h2>
            </div>
            <div className="text-right text-xs font-bold text-slate-600">
              <p>{data.schoolName}</p>
              <p>{data.gradeName} • ឆ្នាំសិក្សា {data.academicYear}</p>
            </div>
          </div>

          {/* Operational Principles Box */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2.5 text-[9.5px] space-y-1 text-slate-800">
            <h4 className="font-moul text-[10px] text-amber-900">គោលការណ៍អនុវត្តន៍ និងតាមដានប្រចាំខែ ៖</h4>
            <p className="leading-normal">
              គណៈកម្មការគ្រប់គ្រងថ្នាក់រៀនត្រូវបើកកិច្ចប្រជុំពិនិត្យការងារជាប្រចាំរៀងរាល់ចុងខែ តាមដានវត្តមាននិងលទ្ធផលសិក្សារបស់សិស្ស ព្រមទាំងចុះជួយសិស្សដែលជួបការលំបាកឱ្យបានទាន់ពេលវេលា។
            </p>
          </div>

          {/* Monthly Activities Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[9px] border border-slate-300">
              <thead className="bg-slate-100 font-bold text-slate-900">
                <tr>
                  <th className="p-1.5 border border-slate-300 text-center w-7">ល.រ</th>
                  <th className="p-1.5 border border-slate-300 min-w-[150px]">សកម្មភាពការងារ</th>
                  <th className="p-1.5 border border-slate-300 w-24">កាលបរិច្ឆេទ</th>
                  <th className="p-1.5 border border-slate-300 w-28">អ្នកចូលរួម</th>
                  <th className="p-1.5 border border-slate-300 w-24">អ្នករៀបចំ</th>
                  <th className="p-1.5 border border-slate-300">ផ្សេងៗ/លទ្ធផលរំពឹងទុក</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlyActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50">
                    <td className="p-1.5 border border-slate-300 text-center font-bold">{act.num}</td>
                    <td className="p-1.5 border border-slate-300 font-medium text-slate-900">{act.title}</td>
                    <td className="p-1.5 border border-slate-300 text-slate-700">{act.dateStr}</td>
                    <td className="p-1.5 border border-slate-300 text-slate-700">{act.participants}</td>
                    <td className="p-1.5 border border-slate-300 font-bold text-blue-900">{act.organizer}</td>
                    <td className="p-1.5 border border-slate-300 text-slate-500 italic">{act.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Final Signatures Footer */}
        <div className="pt-3">
          <div className="flex justify-between items-end text-xs text-center font-bold">
            <div className="space-y-7">
              <p className="font-moul text-[10.5px]">បានឃើញ និងឯកភាព<br/>នាយកសាលា</p>
              <p className="font-moul text-xs text-slate-900">{data.principalName}</p>
            </div>
            <div className="space-y-7">
              <div>
                <p className="text-[9.5px]">{data.mandateDateSolar}</p>
                <p className="font-moul text-[10.5px] mt-0.5">គ្រូបន្ទុកថ្នាក់</p>
              </div>
              <p className="font-moul text-xs text-slate-900">{data.teacherName}</p>
            </div>
          </div>
          <div className="border-t border-slate-300 pt-1.5 mt-2 text-[10px] text-slate-500 flex justify-between items-center">
            <span>ឯកសារផ្លូវការ គ. គ. ថ. • {data.schoolName} • {data.gradeName}</span>
            <span className="font-bold text-slate-700">ទំព័រទី ៨/៨ (ចប់)</span>
          </div>
        </div>
      </div>
      )}

    </div>
  );
};
