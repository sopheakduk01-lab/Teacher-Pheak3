import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Force Inserting Lesson 15 Carousel Card ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

const l14CarouselCardAnchor = 'qe14("tab-hero"),Oe14(!0))';

const l15CarouselCardCode = `(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-amber-500/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-1 ring-amber-400/50",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-amber-950 via-orange-900 to-yellow-900",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-amber-950/95 via-amber-900/40 to-transparent"}),e.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-2",children:[e.jsx("span",{className:"w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg",children:"⚡"}),e.jsx("span",{className:"text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"})]}),e.jsxs("div",{className:"absolute bottom-3 left-3 right-3",children:[e.jsx("h3",{className:"font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1",children:"មេរៀនទី ១៥ ៖ អគ្គិសនី"}),e.jsx("p",{className:"text-[10px] text-amber-200 mt-0.5 font-bold drop-shadow-sm",children:"ជំពូកទី ៥ • ៤០ សំណួរ QCM"})]})]}),e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx("p",{className:"text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]",children:"ស្វែងយល់ពីប្រភពចរន្ត អំពែម៉ែត្រ វ៉ុលម៉ែត្រ អង្គធាតុចម្លង អ៊ីសូឡង់ សៀគ្វីស៊េរី/ខ្នែង និងបណ្តាញអគ្គិសនីក្នុងគេហដ្ឋាន។"}),e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-amber-900 bg-amber-50/80 p-2 rounded-xl border border-amber-100",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"text-amber-600"},{children:"⚡"})," ចរន្តអគ្គិសនី"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"text-cyan-600"},{children:"🔋"})," សៀគ្វីខ្នែង"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1 text-emerald-800",children:[e.jsx("span",{className:"text-emerald-600"},{children:"📝"})," ៤០ QCM"]})]})]})]}),e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[e.jsxs("button",{onClick:()=>{Ut||(qe15("tab-hero"),Oe15(!0));},className:"w-full py-2.5 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"🔬"}),e.jsx("span",{children:"រៀន & ស្វែងយល់"})]}),e.jsxs("button",{onClick:()=>{Ut||(qe15("tab-quiz"),Oe15(!0));},className:"w-full py-2.5 bg-gradient-to-r from-orange-700 via-amber-700 to-yellow-700 hover:from-orange-800 hover:to-amber-800 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📝"}),e.jsx("span",{children:"ប្រឡង ៤០ QCM"})]})]})]}),`;

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  if (!code.includes('qe15("tab-hero")')) {
    // Find the start of Lesson 14 card
    const card14Start = code.lastIndexOf('(H==="all"||H==="វិទ្យាសាស្ត្រ")', code.indexOf(l14CarouselCardAnchor));
    if (card14Start !== -1) {
      code = code.slice(0, card14Start) + l15CarouselCardCode + code.slice(card14Start);
      console.log("SUCCESSFULLY inserted Lesson 15 Carousel Card into " + filePath);
    } else {
      console.error("Could not find Lesson 14 card start in " + filePath);
    }
  } else {
    console.log("Lesson 15 Carousel Card already present in " + filePath);
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

console.log("=== Lesson 15 Carousel Card Insertion Complete! ===");
