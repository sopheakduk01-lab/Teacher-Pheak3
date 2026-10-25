import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Adding Lesson 14 Card & Quiz Trigger Handler ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Add Quiz Click Handler match for Lesson 14
  const l13QuizTriggerPattern = 'Pt.title.includes("ធាតុគីមី"))qe13("tab-quiz"),Oe13(!0);';
  if (code.includes(l13QuizTriggerPattern) && !code.includes('qe14("tab-quiz")')) {
    const l14QuizTrigger = 'Pt.title.includes("ធាតុគីមី"))qe13("tab-quiz"),Oe13(!0);else if(Pt.id.includes("lesson-14")||Pt.id.includes("lesson14")||Pt.title.includes("មេរៀនទី ១៤")||Pt.title.includes("ម៉ាស៊ីនងាយ"))qe14("tab-quiz"),Oe14(!0);';
    code = code.replace(l13QuizTriggerPattern, l14QuizTrigger);
    console.log("Added Lesson 14 Quiz Click Trigger Handler to " + filePath);
  }

  // 2. Add Science Lesson 14 Card right after Lesson 13 Card
  const l13CardEndPattern = 'children:[e.jsx("span",{children:"🎯"}),e.jsx("span",{children:"តេស្ត QCM (៤០)"})]})]})\n]';
  const l13CardEndPattern2 = 'children:[e.jsx("span",{children:"🎯"}),e.jsx("span",{children:"តេស្ត QCM (៤០)"})]})]})]';

  const card14Jsx = `,e.jsxs("div",{className:"group bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg hover:border-blue-300 transition duration-300 overflow-hidden flex flex-col justify-between relative",children:[e.jsxs("div",{className:"relative h-44 overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-sky-700 p-5 flex flex-col justify-between text-white",children:[e.jsxs("div",{className:"flex items-start justify-between z-10",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-extrabold border border-white/30 text-white shadow-xs",children:"ជំពូកទី ៤"}),e.jsx("span",{className:"px-3 py-1 bg-amber-400 text-slate-900 rounded-full text-[11px] font-black shadow-xs",children:"មេរៀនទី ១៤"})]}),e.jsx("span",{className:"text-3xl drop-shadow-md",children:"⚙️"})]}),e.jsxs("div",{className:"z-10 space-y-1",children:[e.jsx("h3",{className:"text-base sm:text-lg font-bold font-moul text-white drop-shadow-xs line-clamp-1",children:"មេរៀនទី ១៤ ៖ ម៉ាស៊ីនងាយ"}),e.jsx("p",{className:"text-xs text-sky-100 font-medium line-clamp-1 opacity-90",children:"ឃ្នាស់ (៣ ប្រភេទ) • ប្លង់ទេរ • រ៉ក (N=1, N=2, N=4) • ៤០ QCM"})]})]}),e.jsxs("div",{className:"p-4 space-y-3 flex-1 flex flex-col justify-between",children:[e.jsx("p",{className:"text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal",children:"ស្វែងយល់ពីគោលការណ៍ម៉ាស៊ីនងាយ ឃ្នាស់ ៣ ប្រភេទ ប្លង់ទេរ និងការគណនាប្រព័ន្ធរ៉ករៀបចំឡើងយ៉ាងពិសិដ្ឋសម្រាប់ថ្នាក់ទី ៦។"}),e.jsxs("div",{className:"flex items-center gap-2 text-[11px] text-slate-500 font-bold border-t border-slate-100 pt-2.5",children:[e.jsxs("span",{className:"flex items-center gap-1 text-blue-700",children:[e.jsx("span",{},"⚖️")," ឃ្នាស់/ប្លង់ទេរ"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1 text-purple-700",children:[e.jsx("span",{},"🏗️")," រ៉ក (N=4)"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1 text-emerald-800",children:[e.jsx("span",{},"📝")," ៤០ QCM"]})]})]}),e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[e.jsxs("button",{onClick:()=>{Ut||(qe14("tab-hero"),Oe14(!0));},className:"w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{},"🔬"),e.jsx("span",{},"រៀន & ស្វែងយល់")]}),e.jsxs("button",{onClick:()=>{Ut||(qe14("tab-quiz"),Oe14(!0));},className:"w-full py-2.5 bg-gradient-to-r from-indigo-800 via-blue-700 to-indigo-600 hover:from-indigo-900 hover:to-blue-800 text-white font-bold rounded-xl text-xs transition duration-200 shadow-xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{},"🎯"),e.jsx("span",{},"តេស្ត QCM (៤០)")]})]})]})`;

  if (!code.includes('មេរៀនទី ១៤ ៖ ម៉ាស៊ីនងាយ')) {
    if (code.includes(l13CardEndPattern2)) {
      code = code.replace(l13CardEndPattern2, l13CardEndPattern2.slice(0, -1) + card14Jsx + ']');
      console.log("Inserted Lesson 14 Card into " + filePath);
    }
  }

  try {
    esbuild.transformSync(code, { loader: 'js' });
    console.log("Validation SUCCESS for " + filePath);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Saved " + filePath + " successfully!");
  } catch (err) {
    console.error("Validation error in " + filePath + ":", err.message);
    process.exit(1);
  }
}

console.log("=== Lesson 14 Card and Handlers Fully Updated! ===");
