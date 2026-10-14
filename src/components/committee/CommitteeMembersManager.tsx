import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { OfficialCommitteeData, CommitteeMember } from '../../types/committeeTypes';

interface Props {
  data: OfficialCommitteeData;
  onUpdateData: (data: OfficialCommitteeData) => void;
  onShowToast?: (msg: string) => void;
}

export const CommitteeMembersManager: React.FC<Props> = ({
  data,
  onUpdateData,
  onShowToast,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<CommitteeMember>>({});

  const handleStartEdit = (m: CommitteeMember) => {
    setEditingId(m.id);
    setForm(m);
  };

  const handleSave = () => {
    if (!form.name || !form.role) return;
    const updated = data.members.map((m) =>
      m.id === editingId ? ({ ...m, ...form } as CommitteeMember) : m
    );
    onUpdateData({ ...data, members: updated });
    setEditingId(null);
    if (onShowToast) onShowToast('បានកែប្រែទិន្នន័យសមាជិកដោយជោគជ័យ');
  };

  const handleAdd = () => {
    const newMember: CommitteeMember = {
      id: String(Date.now()),
      role: 'សមាជិក',
      name: 'សមាជិកថ្មី',
      gender: 'ប្រុស',
      phone: '',
      duties: '',
    };
    onUpdateData({ ...data, members: [...data.members, newMember] });
    setEditingId(newMember.id);
    setForm(newMember);
  };

  const handleDelete = (id: string) => {
    const updated = data.members.filter((m) => m.id !== id);
    onUpdateData({ ...data, members: updated });
    if (onShowToast) onShowToast('បានលុបសមាជិក');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-500" />
          បញ្ជីឈ្មោះ និងបំណែងចែកភារកិច្ចសមាជិក
        </h3>
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>បន្ថែមសមាជិក</span>
        </button>
      </div>

      <div className="space-y-3">
        {data.members.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            {editingId === m.id ? (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="តួនាទី"
                  value={form.role || ''}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="px-2.5 py-1.5 rounded-lg border text-xs"
                />
                <input
                  type="text"
                  placeholder="ឈ្មោះ"
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="px-2.5 py-1.5 rounded-lg border text-xs"
                />
                <select
                  value={form.gender || 'ប្រុស'}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="px-2.5 py-1.5 rounded-lg border text-xs"
                >
                  <option value="ប្រុស">ប្រុស</option>
                  <option value="ស្រី">ស្រី</option>
                </select>
                <input
                  type="text"
                  placeholder="ភារកិច្ច"
                  value={form.duties || ''}
                  onChange={(e) => setForm({ ...form, duties: e.target.value })}
                  className="px-2.5 py-1.5 rounded-lg border text-xs col-span-full"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> រក្សាទុក
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-slate-300 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> បោះបង់
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-700 dark:text-amber-300 text-xs">{m.role}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-bold text-slate-800 dark:text-white text-sm">{m.name}</span>
                    <span className="text-xs text-slate-400">({m.gender})</span>
                  </div>
                  {m.duties && <p className="text-xs text-slate-500 mt-1">{m.duties}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(m)}
                    className="p-1.5 text-slate-500 hover:text-amber-600 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
