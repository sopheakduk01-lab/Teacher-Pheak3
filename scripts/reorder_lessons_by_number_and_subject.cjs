const fs = require('fs');
const path = require('path');

console.log('=== Reordering Lessons Sequentially by Lesson Number and Subject ===');

function reorderBundle(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  let js = fs.readFileSync(filePath, 'utf8');

  // 1. Re-order the 17 Science cards inside interactive_lessons JSX
  const startIdx = js.indexOf('E==="interactive_lessons"?e.jsxs("div"');
  if (startIdx !== -1) {
    const endIdx = js.indexOf('E==="exams"?', startIdx);
    if (endIdx !== -1) {
      const section = js.substring(startIdx, endIdx);
      
      // Split by '(H==="all"||H==="វិទ្យាសាស្ត្រ")'
      const parts = section.split('(H==="all"||H==="វិទ្យាសាស្ត្រ")');
      if (parts.length >= 18) {
        const cardBlocks = parts.slice(1, 18);
        const restSection = parts.slice(18).join('(H==="all"||H==="វិទ្យាសាស្ត្រ")');

        const cardMap = {};
        const khmerNums = {'០':0,'១':1,'២':2,'៣':3,'៤':4,'៥':5,'៦':6,'៧':7,'៨':8,'៩':9};

        cardBlocks.forEach((block, idx) => {
          const match = block.match(/children:["']មេរៀនទី\s*([\d\u17E0-\u17E90-9]+)/);
          let num = 99;
          if (match) {
            let str = match[1];
            let res = '';
            for (let ch of str) {
              res += khmerNums[ch] !== undefined ? khmerNums[ch] : ch;
            }
            num = parseInt(res, 10) || 99;
          }
          console.log(`Parsed block ${idx + 1} -> Lesson ${num}`);
          cardMap[num] = block;
        });

        const sortedCardBlocks = [];
        for (let i = 1; i <= 17; i++) {
          if (cardMap[i]) {
            sortedCardBlocks.push(cardMap[i]);
          } else {
            console.warn('Science Lesson card ' + i + ' missing in cardMap!');
          }
        }

        if (sortedCardBlocks.length === 17) {
          const newSection = parts[0] + '(H==="all"||H==="វិទ្យាសាស្ត្រ")' + sortedCardBlocks.join('(H==="all"||H==="វិទ្យាសាស្ត្រ")') + '(H==="all"||H==="វិទ្យាសាស្ត្រ")' + restSection;
          js = js.slice(0, startIdx) + newSection + js.slice(endIdx);
          console.log('Successfully re-ordered all 17 Science cards sequentially in JSX for', filePath);
        } else {
          console.warn('Could not sort cards cleanly, length mismatch:', sortedCardBlocks.length);
        }
      }
    }
  }

  // 2. Add sorting inside he hook if not already added
  if (!js.includes('parseLessonNum')) {
    const heHookTarget = 'at.some(ys=>ys.id===Iz.id||ys.subject==="វិទ្យាសាស្ត្រ"&&ys.title.includes("មេរៀនទី ១"))||at.unshift(Iz),at';
    
    const khmerSortHelper = `const parseLessonNum = (item) => {
      if (!item || !item.title) return 999;
      const match = item.title.match(/មេរៀនទី\\s*([\\d\\u17E0-\\u17E90-9]+)/);
      if (!match) return 999;
      const khmerDigits = {'០':0,'១':1,'២':2,'៣':3,'៤':4,'៥':5,'៦':6,'៧':7,'៨':8,'៩':9};
      let numStr = match[1];
      let res = '';
      for (let ch of numStr) {
        res += khmerDigits[ch] !== undefined ? khmerDigits[ch] : ch;
      }
      return parseInt(res, 10) || 999;
    };
    const subjPriority = {'វិទ្យាសាស្ត្រ':1,'គណិតវិទ្យា':2,'ភាសាខ្មែរ':3,'សិក្សាសង្គម':4,'អប់រំសុខភាព':5,'ភាសាអង់គ្លេស':6};
    at.sort((a,b) => {
      const sA = subjPriority[a.subject] || 99;
      const sB = subjPriority[b.subject] || 99;
      if (sA !== sB) return sA - sB;
      return parseLessonNum(a) - parseLessonNum(b);
    });`;

    if (js.includes(heHookTarget)) {
      js = js.replace(heHookTarget, 'at.some(ys=>ys.id===Iz.id||ys.subject==="វិទ្យាសាស្ត្រ"&&ys.title.includes("មេរៀនទី ១"))||at.unshift(Iz); ' + khmerSortHelper + '; return at');
      console.log('Successfully injected automatic Subject & Lesson number sorting into he hook in', filePath);
    }
  }

  fs.writeFileSync(filePath, js, 'utf8');
}

reorderBundle(path.join(__dirname, '../public/assets/index-BwPwHqBe.js'));
reorderBundle(path.join(__dirname, '../dist/assets/index-BwPwHqBe.js'));

console.log('=== Done reordering lessons! ===');
