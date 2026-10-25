import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Adding High Quality Cover Image Thumbnails to Lesson 14 and 15 Cards ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

const oldL14CardHeader = `e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-blue-950 via-indigo-900 to-sky-900",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-900/40 to-transparent"}),`;

const newL14CardHeader = `e.jsxs("div",{className:"relative h-44 overflow-hidden",children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",alt:"ម៉ាស៊ីនងាយ",className:"absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80"}),e.jsx("div",{className:"absolute -right-6 -bottom-8 w-32 h-32 opacity-20 pointer-events-none rotate-12 transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-6",children:e.jsx("img",{src:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Logo_of_MoEYS_Cambodia.png/800px-Logo_of_MoEYS_Cambodia.png",alt:"MoEYS Watermark",className:"w-full h-full object-contain"})}),`;

const oldL15CardHeader = `e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-amber-950 via-orange-900 to-yellow-900",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-amber-950/95 via-amber-900/40 to-transparent"}),`;

const newL15CardHeader = `e.jsxs("div",{className:"relative h-44 overflow-hidden",children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",alt:"អគ្គិសនី",className:"absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80"}),e.jsx("div",{className:"absolute -right-6 -bottom-8 w-32 h-32 opacity-20 pointer-events-none rotate-12 transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-6",children:e.jsx("img",{src:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Logo_of_MoEYS_Cambodia.png/800px-Logo_of_MoEYS_Cambodia.png",alt:"MoEYS Watermark",className:"w-full h-full object-contain"})}),`;

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  let modified = false;

  if (code.includes(oldL14CardHeader)) {
    code = code.replace(oldL14CardHeader, newL14CardHeader);
    console.log("Updated Lesson 14 card image in " + filePath);
    modified = true;
  }

  if (code.includes(oldL15CardHeader)) {
    code = code.replace(oldL15CardHeader, newL15CardHeader);
    console.log("Updated Lesson 15 card image in " + filePath);
    modified = true;
  }

  if (modified) {
    try {
      esbuild.transformSync(code, { loader: 'js' });
      console.log("Validation SUCCESS for " + filePath);
      fs.writeFileSync(filePath, code, 'utf8');
      console.log("Saved " + filePath + " with card thumbnail images!");
    } catch (err) {
      console.error("Validation error in " + filePath + ":", err.message);
      process.exit(1);
    }
  } else {
    console.log("No old card header found or already updated in " + filePath);
  }
}

console.log("=== Lesson 14 and 15 Thumbnail Images Updated Successfully! ===");
