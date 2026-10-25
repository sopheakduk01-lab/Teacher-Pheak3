import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Force Inserting Lesson 14 Carousel Card ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

const l13CarouselCardAnchor = '(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-emerald-500/90';

const l14CarouselCardCode = `(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-blue-500/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-1 ring-blue-400/50",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-blue-950 via-indigo-900 to-sky-900",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-900/40 to-transparent"}),e.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-2",children:[e.jsx("span",{className:"w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg",children:"⚙️"}),e.jsx("span",{className:"text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"})]}),e.jsxs("div",{className:"absolute bottom-3 left-3 right-3",children:[e.jsx("h3",{className:"font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1",children:"មេរៀនទី ១៤ ៖ ម៉ាស៊ីនងាយ"}),e.jsx("p",{className:"text-[10px] text-blue-200 mt-0.5 font-bold drop-shadow-sm",children:"ជំពូកទី ៤ • ៤០ សំណួរ QCM"})]})]}),e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx("p",{className:"text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]",children:"ស្វែងយល់ពីគោលការណ៍ម៉ាស៊ីនងាយ ឃ្នាស់ ៣ ប្រភេទ ប្លង់ទេរ និងការគណនាប្រព័ន្ធរ៉ករៀបចំឡើងយ៉ាងពិសិដ្ឋសម្រាប់ថ្នាក់ទី ៦។"}),e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-blue-900 bg-blue-50/80 p-2 rounded-xl border border-blue-100",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"text-blue-600"},{children:"⚖️"})," ឃ្នាស់ ៣ ប្រភេទ"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"text-purple-600"},{children:"🏗️"})," ប្រព័ន្ធរ៉ក"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1 text-emerald-800",children:[e.jsx("span",{className:"text-emerald-600"},{children:"📝"})," ៤០ QCM"]})]})]})]}),e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[e.jsxs("button",{onClick:()=>{Ut||(qe14("tab-hero"),Oe14(!0));},className:"w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"🔬"}),e.jsx("span",{children:"រៀន & ស្វែងយល់"})]}),e.jsxs("button",{onClick:()=>{Ut||(qe14("tab-quiz"),Oe14(!0));},className:"w-full py-2.5 bg-gradient-to-r from-indigo-800 via-blue-700 to-indigo-600 hover:from-indigo-900 hover:to-blue-800 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📝"}),e.jsx("span",{children:"ប្រឡង ៤០ QCM"})]})]})]}),`;

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // Specific check if the carousel card itself is present
  if (!code.includes('qe14("tab-hero")')) {
    const pos = code.indexOf(l13CarouselCardAnchor);
    if (pos !== -1) {
      code = code.slice(0, pos) + l14CarouselCardCode + code.slice(pos);
      console.log("SUCCESSFULLY inserted Lesson 14 Carousel Card into " + filePath);
    } else {
      console.error("Could not find Lesson 13 carousel card anchor in " + filePath);
      process.exit(1);
    }
  } else {
    console.log("Lesson 14 Carousel Card already present in " + filePath);
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

console.log("=== Lesson 14 Carousel Card Insertion Complete! ===");
