import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Force Inserting Lesson 16 Carousel Card ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

const l15CarouselCardAnchor = 'qe15("tab-hero"),Oe15(!0))';

const l16CarouselCardCode = `(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-sky-500/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-1 ring-sky-400/50",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-sky-950 via-blue-900 to-cyan-900",children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=800&auto=format&fit=crop",alt:"មេរៀនទី ១៦",className:"absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-60"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-sky-950/95 via-sky-900/40 to-transparent"}),e.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-2",children:[e.jsx("span",{className:"w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg",children:"⛅"}),e.jsx("span",{className:"text-[10px] font-black px-2 py-0.5 rounded-lg bg-sky-400 text-slate-950 shadow-xs uppercase tracking-wider",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"})]}),e.jsxs("div",{className:"absolute top-3 right-3 bg-black/40 backdrop-blur-md border border-white/20 text-white/90 text-[9px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 shadow-xs",children:[e.jsx("span",{className:"text-cyan-300",children:"🇰🇭"})," MoEYS Standards"]}),e.jsxs("div",{className:"absolute bottom-3 left-3 right-3",children:[e.jsx("h3",{className:"font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1",children:"មេរៀនទី ១៦ ៖ ធាតុអាកាស"}),e.jsx("p",{className:"text-[10px] text-sky-200 mt-0.5 font-bold drop-shadow-sm",children:"ជំពូកទី ៥ • ៤០ សំណួរ QCM"})]})]}),e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx("p",{className:"text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]",children:"ស្វែងយល់ពីនិយមន័យធាតុអាកាស កត្តាកំណត់ធាតុអាកាស (ពន្លឺព្រះអាទិត្យ ខ្យល់ ពពក) រដូវកាលនៅកម្ពុជា និងបាតុភូតធម្មជាតិ (ស្តាឡាក់ទីត និងស្តាឡាក់មីត)។"}),e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-sky-900 bg-sky-50/80 p-2 rounded-xl border border-sky-100",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"text-sky-600"},{children:"⛅"})," ធាតុអាកាស"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"text-blue-600"},{children:"🌪️"})," ចរន្តខ្យល់"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1 text-emerald-800",children:[e.jsx("span",{className:"text-emerald-600"},{children:"📝"})," ៤០ QCM"]})]})]})]}),e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[e.jsxs("button",{onClick:()=>{Ut||(qe16("tab-hero"),Oe16(!0));},className:"w-full py-2.5 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"🔬"}),e.jsx("span",{children:"រៀន & ស្វែងយល់"})]}),e.jsxs("button",{onClick:()=>{Ut||(qe16("tab-quiz"),Oe16(!0));},className:"w-full py-2.5 bg-gradient-to-r from-blue-700 via-sky-700 to-cyan-700 hover:from-blue-800 hover:to-sky-800 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📝"}),e.jsx("span",{children:"ប្រឡង ៤០ QCM"})]})]})]}),`;

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  if (!code.includes('qe16("tab-hero")')) {
    // Find the start of Lesson 15 card
    const card15Start = code.lastIndexOf('(H==="all"||H==="វិទ្យាសាស្ត្រ")', code.indexOf(l15CarouselCardAnchor));
    if (card15Start !== -1) {
      code = code.slice(0, card15Start) + l16CarouselCardCode + code.slice(card15Start);
      console.log("SUCCESSFULLY inserted Lesson 16 Carousel Card into " + filePath);
    } else {
      console.error("Could not find Lesson 15 card start in " + filePath);
    }
  } else {
    console.log("Lesson 16 Carousel Card already present in " + filePath);
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

console.log("=== Lesson 16 Carousel Card Insertion Complete! ===");
