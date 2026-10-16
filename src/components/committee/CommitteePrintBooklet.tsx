import React from 'react';
import { OfficialCommitteeData } from '../../types/committeeTypes';

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
  const shouldRender = (scope: CommitteePrintPageScope) =>
    printScope === 'all' || printScope === scope;

  return (
    <div
      className={`font-khmer ${
        isScreenPreview
          ? 'space-y-8 max-w-4xl mx-auto'
          : 'hidden print:block'
      }`}
    >
      {/* 1. Cover Page */}
      {shouldRender('cover') && (
        <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 min-h-[900px] flex flex-col justify-between text-center print:border-none print:shadow-none print:p-0 print:min-h-screen print:break-after-page">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {data.districtName || 'ការិយាល័យអប់រំ យុវជន និងកីឡា'}
            </h4>
            <h3 className="text-sm font-bold text-slate-800">{data.schoolName}</h3>
          </div>

          <div className="my-12 space-y-4">
            <h1 className="text-2xl font-bold text-slate-900 leading-relaxed font-moul">
              សៀវភៅគ្រប់គ្រង
              <br />
              គណៈកម្មការថ្នាក់រៀន
            </h1>
            <div className="h-1 w-24 bg-amber-500 mx-auto rounded-full"></div>
            <h2 className="text-lg font-bold text-amber-800">{data.gradeName}</h2>
            <p className="text-sm text-slate-600">ឆ្នាំសិក្សា {data.academicYear}</p>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <p>គ្រូបន្ទុកថ្នាក់ ៖ <strong className="text-slate-800">{data.teacherName}</strong></p>
            <p>នាយកសាលា ៖ <strong className="text-slate-800">{data.principalName}</strong></p>
          </div>
        </div>
      )}

      {/* 2. Org Chart */}
      {shouldRender('chart') && (
        <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 min-h-[900px] print:border-none print:shadow-none print:p-0 print:min-h-screen print:break-after-page">
          <div className="text-center border-b pb-4 mb-6">
            <h3 className="text-lg font-bold">ផ្នែកទី ១ ៖ រចនាសម្ព័ន្ធគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន</h3>
            <p className="text-xs text-slate-500">{data.schoolName} — {data.gradeName}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {data.members.map((m, idx) => (
              <div key={idx} className="p-4 border rounded-xl bg-slate-50">
                <span className="text-xs font-bold text-amber-700">{m.role}</span>
                <h4 className="text-sm font-bold mt-1">{m.name}</h4>
                <p className="text-xs text-slate-500">ភេទ ៖ {m.gender}</p>
                {m.duties && <p className="text-xs text-slate-600 mt-2">{m.duties}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Members List */}
      {shouldRender('members') && (
        <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 min-h-[900px] print:border-none print:shadow-none print:p-0 print:min-h-screen print:break-after-page">
          <div className="text-center border-b pb-4 mb-6">
            <h3 className="text-lg font-bold">ផ្នែកទី ២ ៖ បញ្ជីឈ្មោះ និងបំណែងចែកភារកិច្ច</h3>
          </div>
          <table className="w-full text-xs text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-2 text-center w-12">ល.រ</th>
                <th className="border border-slate-300 p-2">គោត្តនាម-នាម</th>
                <th className="border border-slate-300 p-2 text-center w-16">ភេទ</th>
                <th className="border border-slate-300 p-2">តួនាទី</th>
                <th className="border border-slate-300 p-2">ភារកិច្ចទទួលខុសត្រូវ</th>
              </tr>
            </thead>
            <tbody>
              {data.members.map((m, idx) => (
                <tr key={idx}>
                  <td className="border border-slate-300 p-2 text-center">{idx + 1}</td>
                  <td className="border border-slate-300 p-2 font-bold">{m.name}</td>
                  <td className="border border-slate-300 p-2 text-center">{m.gender}</td>
                  <td className="border border-slate-300 p-2 text-amber-800 font-semibold">{m.role}</td>
                  <td className="border border-slate-300 p-2">{m.duties || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Mandate */}
      {shouldRender('mandate') && (
        <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 min-h-[900px] print:border-none print:shadow-none print:p-0 print:min-h-screen print:break-after-page">
          <div className="text-center border-b pb-4 mb-6">
            <h3 className="text-lg font-bold">ផ្នែកទី ៣ ៖ លិខិតបង្គាប់ការ</h3>
            <p className="text-xs text-slate-500">លេខ ៖ {data.mandateNumber}</p>
          </div>
          <div className="text-xs space-y-4 leading-relaxed">
            <p>យោងតាមការអនុវត្តសកម្មភាពគ្រប់គ្រងថ្នាក់រៀន ឆ្នាំសិក្សា {data.academicYear} ...</p>
            <p><strong>សម្រេច ៖ </strong> បង្កើតគណៈកម្មការគ្រប់គ្រងថ្នាក់រៀន {data.gradeName} នៃ {data.schoolName}...</p>
          </div>
        </div>
      )}

      {/* 5. Minutes */}
      {shouldRender('minutes') && (
        <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 min-h-[900px] print:border-none print:shadow-none print:p-0 print:min-h-screen print:break-after-page">
          <div className="text-center border-b pb-4 mb-6">
            <h3 className="text-lg font-bold">ផ្នែកទី ៤ ៖ កំណត់ហេតុប្រជុំ</h3>
          </div>
          <div className="text-xs space-y-3">
            <p><strong>កាលបរិច្ឆេទ ៖ </strong> {data.meetingMinutes?.meetingDate}</p>
            <p><strong>ទីកន្លែង ៖ </strong> {data.meetingMinutes?.location}</p>
            <p><strong>របៀបវារៈ ៖ </strong> {data.meetingMinutes?.agenda}</p>
            <p><strong>សេចក្តីសម្រេច ៖ </strong> {data.meetingMinutes?.decisions}</p>
          </div>
        </div>
      )}

      {/* 6. Annual Plan */}
      {shouldRender('annual') && (
        <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 min-h-[900px] print:border-none print:shadow-none print:p-0 print:min-h-screen print:break-after-page">
          <div className="text-center border-b pb-4 mb-6">
            <h3 className="text-lg font-bold">ផ្នែកទី ៥ ៖ ផែនការសកម្មភាពប្រចាំឆ្នាំ</h3>
          </div>
          <p className="text-xs mb-4"><strong>គោលបំណង ៖ </strong> {data.annualPlan?.objectives}</p>
          <div className="space-y-2">
            {data.annualPlan?.activities.map((act, idx) => (
              <div key={idx} className="p-3 border rounded-xl text-xs flex justify-between">
                <span>{act.title}</span>
                <span className="text-slate-500">ខែ {act.month} ({act.responsible})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Quarterly Plan */}
      {shouldRender('quarterly') && (
        <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 min-h-[900px] print:border-none print:shadow-none print:p-0 print:min-h-screen print:break-after-page">
          <div className="text-center border-b pb-4 mb-6">
            <h3 className="text-lg font-bold">ផ្នែកទី ៦ ៖ ផែនការសកម្មភាពតាមត្រីមាស</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            {data.quarterlyPlan?.map((q, idx) => (
              <div key={idx} className="p-3 border rounded-xl">
                <h4 className="font-bold text-amber-700">{q.quarter}</h4>
                <p className="mt-1">{q.focus}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Monthly Plan */}
      {shouldRender('monthly') && (
        <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 min-h-[900px] print:border-none print:shadow-none print:p-0 print:min-h-screen print:break-after-page">
          <div className="text-center border-b pb-4 mb-6">
            <h3 className="text-lg font-bold">ផ្នែកទី ៧ ៖ ផែនការសកម្មភាពប្រចាំខែ</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            {data.monthlyPlan?.map((m, idx) => (
              <div key={idx} className="p-3 border rounded-xl">
                <h4 className="font-bold text-amber-700">ខែ {m.month}</h4>
                <p className="mt-1">{m.goals}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
