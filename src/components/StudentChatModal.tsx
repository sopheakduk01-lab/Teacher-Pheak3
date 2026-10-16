import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, User, BookOpen, Lightbulb, Calculator, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'student';
  text: string;
  time: string;
}

const PRESET_KNOWLEDGE: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['ការ៉េ', 'square', 'ផ្ទៃក្រឡាការ៉េ', 'បរិមាត្រការ៉េ'],
    reply: '📐 **រូបមន្តការ៉េ (Square)** ៖\n- **ផ្ទៃក្រឡា (Area)** ៖ S = ជ្រុង × ជ្រុង (a × a)\n- **បរិមាត្រ (Perimeter)** ៖ P = ជ្រុង × ៤ (a × ៤)\n\n*ឧទាហរណ៍* ៖ ការ៉េមានជ្រុង ៦ស.ម ៖ S = ៦ × ៦ = ៣៦ ស.ម², P = ៦ × ៤ = ២៤ ស.ម។',
  },
  {
    keywords: ['ចតុកោណកែង', 'rectangle', 'ផ្ទៃក្រឡាចតុកោណកែង'],
    reply: '📏 **រូបមន្តចតុកោណកែង (Rectangle)** ៖\n- **ផ្ទៃក្រឡា (Area)** ៖ S = បណ្តោយ (L) × ទទឹង (w)\n- **បរិមាត្រ (Perimeter)** ៖ P = (បណ្តោយ + ទទឹង) × ២\n\n*ឧទាហរណ៍* ៖ បណ្តោយ ៨ម, ទទឹង ៥ម ៖ S = ៨ × ៥ = ៤០ ម²។',
  },
  {
    keywords: ['ត្រីកោណ', 'triangle'],
    reply: '🔺 **រូបមន្តត្រីកោណ (Triangle)** ៖\n- **ផ្ទៃក្រឡា (Area)** ៖ S = (បាត b × កម្ពស់ h) ÷ ២\n\n*ឧទាហរណ៍* ៖ បាត ១០ស.ម, កម្ពស់ ៤ស.ម ៖ S = (១០ × ៤) ÷ ២ = ២០ ស.ម²។',
  },
  {
    keywords: ['រង្វង់', 'circle'],
    reply: '⭕ **រូបមន្តរង្វង់ (Circle)** ៖\n- **បរិមាត្រ (Circumference)** ៖ C = អង្កត់ផ្ចិត d × ៣,១៤ (ឬ ២ × π × r)\n- **ផ្ទៃក្រឡា (Area)** ៖ S = កាំ r × កាំ r × ៣,១៤\n\n*ចំណាំ* ៖ π (ពី) ≈ ៣,១៤ ឬ ២២/៧។',
  },
  {
    keywords: ['ល្បឿន', 'ចម្ងាយ', 'ពេល', 'speed'],
    reply: '🚗 **រូបមន្តល្បឿន ចម្ងាយ និងពេលវេលា** ៖\n- **ល្បឿន (V)** = ចម្ងាយ (S) ÷ ពេលវេលា (T)\n- **ចម្ងាយ (S)** = ល្បឿន (V) × ពេលវេលា (T)\n- **ពេលវេលា (T)** = ចម្ងាយ (S) ÷ ល្បឿន (V)',
  },
  {
    keywords: ['នាម', 'កិរិយា', 'គុណនាម', 'វេយ្យាករណ៍'],
    reply: '📖 **ថ្នាក់ពាក្យខ្មែរ** ៖\n- **នាមសព្ទ** ៖ សំដៅលើឈ្មោះមនុស្ស សត្វ វត្ថុ ឬទីកន្លែង (ឧ. សិស្ស, សាលា, ឆ្មា)\n- **កិរិយាសព្ទ** ៖ សំដៅលើអំពើ ឬសកម្មភាព (ឧ. រត់, រៀន, ញ៉ាំ)\n- **គុណនាម** ៖ បញ្ជាក់លក្ខណៈរបស់នាម (ឧ. ស្អាត, ឆ្លាត, ខ្ពស់, លឿន)',
  },
  {
    keywords: ['រស្មីសំយោគ', 'photosynthesis', 'រុក្ខជាតិ'],
    reply: '🌱 **ដំណើររស្មីសំយោគ (Photosynthesis)** ៖\nរុក្ខជាតិបៃតងប្រើពន្លឺព្រះអាទិត្យ ទឹក (H2O) និងឧស្ម័នកាបូនិច (CO2) តាមរយៈប្លាសបៃតង (Chlorophyll) ដើម្បីបង្កើតស្ករគ្លុយកូសជាអាហារ និងបញ្ចេញឧស្ម័នអុកស៊ីសែន (O2) សម្រាប់ជីវិតមនុស្សនិងសត្វ។',
  },
];

interface StudentChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
}

export const StudentChatModal: React.FC<StudentChatModalProps> = ({
  isOpen,
  onClose,
  studentName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `សួស្ដីน้อง ${studentName}! ខ្ញុំជាជំនួយការសិក្សាឆ្លាតវៃ (AI Study Assistant) សម្រាប់សិស្សបឋមសិក្សា។ តើប្អូនមានចម្ងល់មេរៀន រូបមន្តគណិតវិទ្យា ឬសំណួរអ្វីចង់សួរខ្ញុំដែរឬទេ?`,
      time: 'ឥឡូវនេះ',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'student',
      text: query,
      time: new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate smart response based on knowledge base
    setTimeout(() => {
      let matchedReply = '';
      const qLower = query.toLowerCase();

      for (const item of PRESET_KNOWLEDGE) {
        if (item.keywords.some((kw) => qLower.includes(kw.toLowerCase()))) {
          matchedReply = item.reply;
          break;
        }
      }

      if (!matchedReply) {
        matchedReply = `✨ ចម្លើយសម្រាប់សំណួរ «${query}» ៖\nដើម្បីដោះស្រាយបញ្ហានេះ សូមប្អូនពិនិត្យមើលរូបមន្ត និងមេរៀនសង្ខេបក្នុងផ្ទាំង «រូបមន្ត & គន្លឹះមេរៀន» ឬសាកល្បងសួរសំណួរជាក់លាក់ដូចជា «រូបមន្តការ៉េ», «រូបមន្តរង្វង់», «ថ្នាក់ពាក្យ», «រស្មីសំយោគ» ជាដើម។`;
      }

      const aiMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: matchedReply,
        time: new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 text-slate-900 flex flex-col h-[560px]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                <span>ជំនួយការសិក្សាឆ្លាតវៃ</span>
                <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">Online</span>
              </h3>
              <p className="text-[11px] text-indigo-200">ឆ្លើយសំណួរមេរៀន & គន្លឹះគណិតវិទ្យា</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompt Suggestions */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            'រូបមន្តការ៉េ និងចតុកោណកែង',
            'រូបមន្តត្រីកោណ',
            'រូបមន្តរង្វង់',
            'ថ្នាក់ពាក្យខ្មែរ',
            'ដំណើររស្មីសំយោគ',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-bold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 px-2.5 py-1 rounded-full shrink-0 transition shadow-2xs"
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 no-scrollbar bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'student' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                  msg.sender === 'student'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-purple-100 text-purple-700 font-bold'
                }`}
              >
                {msg.sender === 'student' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'student'
                    ? 'bg-indigo-600 text-white rounded-tr-xs shadow-sm font-medium'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs whitespace-pre-wrap'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[9px] mt-1 ${
                    msg.sender === 'student' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="សួរសំណួរមេរៀន ឬរូបមន្តទីនេះ..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition shadow-md shadow-indigo-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
