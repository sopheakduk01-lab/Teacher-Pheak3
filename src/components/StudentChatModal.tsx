import React, { useState } from 'react';
import { X, Send, Bot, User } from 'lucide-react';

interface StudentChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

export const StudentChatModal: React.FC<StudentChatModalProps> = ({
  isOpen,
  onClose,
  studentName,
}) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'bot', text: `សួស្តីប្អូន ${studentName || 'សិស្ស'}! តើប្អូនមានចម្ងល់មេរៀនអ្វីដែលចង់សួរទេ?` },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'សំណួរល្អណាស់! សូមពិនិត្យមើលសៀវភៅពុម្ពថ្នាក់ទី៦ ឬសួរលោកគ្រូ/អ្នកគ្រូបន្ថែមក្នុងម៉ោងរៀនណា៎! 🌟',
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md h-[500px] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg">
              💬
            </div>
            <h3 className="font-bold text-sm font-moul">ជំនួយការរៀនសូត្រសិស្ស</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-white/10 hover:bg-white/20">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs shrink-0">
                  🤖
                </div>
              )}
              <div
                className={`p-3 rounded-2xl text-xs sm:text-sm max-w-[80%] ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="វាយបញ្ចូលសំណួរ..."
            className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
