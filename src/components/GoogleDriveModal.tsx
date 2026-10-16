import React, { useState, useEffect } from 'react';
import { X, Folder, FileText, FileSpreadsheet, Image as ImageIcon, Download, Upload, Search, LogIn, LogOut, CheckCircle2, Cloud, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initAuth, googleSignIn, getAccessToken, logout } from '../lib/googleDriveAuth';
import { User } from 'firebase/auth';
import { LibraryBook } from '../types';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportBook: (book: Omit<LibraryBook, 'id' | 'uploadedDate'>) => void;
  onShowToast: (msg: string) => void;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  thumbnailLink?: string;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  onImportBook,
  onShowToast,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportTitle, setExportTitle] = useState<string>('កិច្ចការស្វ័យសិក្សា និងមេរៀនបឋម');
  const [exportContent, setExportContent] = useState<string>('មេរៀនទី១៖ ភាសាខ្មែរថ្នាក់ទី២ ស្ដីពីការអាននិងសរសេរអក្សរ។');

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = initAuth(
      (token, currentUser) => {
        setUser(currentUser);
        setAccessToken(token);
        setNeedsAuth(false);
        fetchDriveFiles(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, [isOpen]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setNeedsAuth(false);
        onShowToast('✅ បានតភ្ជាប់ជាមួយ Google Drive ដោយជោគជ័យ!');
        fetchDriveFiles(res.accessToken);
      }
    } catch (err) {
      console.error(err);
      onShowToast('❌ ការតភ្ជាប់ Google Drive មិនបានជោគជ័យ សូមព្យាយាមម្តងទៀត។');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setNeedsAuth(true);
    setFiles([]);
    onShowToast('បានផ្តាច់ការតភ្ជាប់ Google Drive រួចរាល់។');
  };

  const fetchDriveFiles = async (token?: string) => {
    const tokenToUse = token || (await getAccessToken());
    if (!tokenToUse) return;

    try {
      setIsLoading(true);
      const res = await fetch(
        'https://www.googleapis.com/drive/v3/files?pageSize=30&fields=files(id,name,mimeType,webViewLink,thumbnailLink)',
        {
          headers: { Authorization: `Bearer ${tokenToUse}` },
        }
      );
      if (!res.ok) throw new Error('Failed to fetch files');
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error(err);
      onShowToast('⚠️ មានបញ្ហាក្នុងការទាញយកទិន្នន័យពី Google Drive។');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportFile = async (file: DriveFile) => {
    const token = await getAccessToken();
    if (!token) return;

    onShowToast(`កំពុងទាញយកឯកសារ "${file.name}"...`);

    try {
      // Determine if Google Doc or binary
      let fileData = '';
      let fileType: 'pdf' | 'image' | 'text' | 'epub' = 'text';

      if (file.mimeType.includes('pdf')) {
        fileType = 'pdf';
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const blob = await res.blob();
        fileData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } else if (file.mimeType.includes('image')) {
        fileType = 'image';
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const blob = await res.blob();
        fileData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } else {
        // Export google docs or fetch text
        fileType = 'text';
        if (file.mimeType.includes('google-apps.document')) {
          const res = await fetch(
            `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          fileData = await res.text();
        } else {
          try {
            const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            fileData = await res.text();
          } catch {
            fileData = `ឯកសារពី Google Drive: ${file.name}`;
          }
        }
      }

      onImportBook({
        title: file.name,
        author: user?.displayName || 'Google Drive User',
        category: 'ឯកសារយោង',
        description: `ឯកសារនាំចូលពី Google Drive (${file.name})`,
        coverUrl: file.thumbnailLink || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
        fileData: fileData || 'មាតិកាឯកសារ Google Drive',
        fileType,
        pagesCount: 15,
      });

      onShowToast(`✅ បាននាំចូល "${file.name}" ចូលបណ្ណាល័យដោយជោគជ័យ!`);
      onClose();
    } catch (err) {
      console.error(err);
      onShowToast('❌ មិនអាចនាំចូលឯកសារនេះបានទេ។');
    }
  };

  const handleUploadToDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getAccessToken();
    if (!token) return;

    try {
      setIsLoading(true);
      const metadata = {
        name: `${exportTitle}.txt`,
        mimeType: 'text/plain',
      };

      const form = new FormData();
      form.append(
        'metadata',
        new Blob([JSON.stringify(metadata)], { type: 'application/json' })
      );
      form.append('file', new Blob([exportContent], { type: 'text/plain' }));

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) throw new Error('Upload failed');
      onShowToast('✅ បានរក្សាទុកឯកសារទៅ Google Drive ជោគជ័យ!');
      fetchDriveFiles(token);
    } catch (err) {
      console.error(err);
      onShowToast('❌ មានបញ្ហាក្នុងការរក្សាទុកទៅ Google Drive។');
    } finally {
      setIsLoading(false);
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black">Google Drive Integration</h3>
              <p className="text-xs text-purple-200">តភ្ជាប់និងគ្រប់គ្រងឯកសារបង្រៀនពី Google Drive</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {needsAuth ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-700 shadow-inner">
                <Cloud className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-800">តភ្ជាប់គណនី Google Drive របស់អ្នក</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  ចូលរួមប្រើប្រាស់គណនី Google ដើម្បីនាំចូលសៀវភៅ ឯកសារ PDF និងកំណត់ត្រាបង្រៀនដោយផ្ទាល់ពី Google Drive របស់អ្នក។
                </p>
              </div>

              {/* Sign in with Google Button */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="gsi-material-button mx-auto shadow-md hover:shadow-lg transition cursor-pointer active:scale-95"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">Sign in with Google</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* User Info & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-900 text-white font-bold flex items-center justify-center text-xl shadow-inner">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user?.displayName?.[0] || '👨‍🏫'
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{user?.displayName || 'លោកគ្រូ អ្នកគ្រូ'}</h4>
                    <p className="text-[11px] text-slate-500">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => fetchDriveFiles()}
                    className="flex-1 sm:flex-none bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>ផ្ទុកឡើងវិញ</span>
                  </button>
                  <button
                    onClick={() => setIsExporting(true)}
                    className="flex-1 sm:flex-none bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>រក្សាទុកមេរៀនទៅ Drive</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition"
                    title="ចាកចេញ"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Export Modal Inline Form */}
              {isExporting && (
                <form onSubmit={handleUploadToDrive} className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-extrabold text-indigo-900">📤 បង្កើតនិងរក្សាទុកឯកសារថ្មីទៅ Google Drive</h5>
                    <button type="button" onClick={() => setIsExporting(false)} className="text-slate-500 hover:text-slate-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ចំណងជើងឯកសារ</label>
                      <input
                        type="text"
                        value={exportTitle}
                        onChange={(e) => setExportTitle(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">មាតិកាសង្ខេប</label>
                      <textarea
                        rows={2}
                        value={exportContent}
                        onChange={(e) => setExportContent(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsExporting(false)}
                      className="px-3 py-1.5 bg-white text-slate-600 rounded-xl font-bold text-xs border"
                    >
                      បោះបង់
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-1.5 bg-indigo-900 text-white rounded-xl font-bold text-xs shadow hover:bg-indigo-800"
                    >
                      {isLoading ? 'កំពុងបញ្ជូន...' : 'បញ្ជូនទៅ Google Drive'}
                    </button>
                  </div>
                </form>
              )}

              {/* Search & File List */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ស្វែងរកឯកសារក្នុង Google Drive..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                  />
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {filteredFiles.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      {isLoading ? 'កំពុងទាញយកទិន្នន័យពី Drive...' : 'រកមិនឃើញឯកសារក្នុង Google Drive ទេ។'}
                    </div>
                  ) : (
                    filteredFiles.map((file) => {
                      const isPdf = file.mimeType.includes('pdf');
                      const isImage = file.mimeType.includes('image');
                      const isDoc = file.mimeType.includes('document');

                      return (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3.5 hover:bg-purple-50/50 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isPdf ? 'bg-rose-100 text-rose-700' : isImage ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {isPdf ? <FileText className="w-5 h-5" /> : isImage ? <ImageIcon className="w-5 h-5" /> : <FileSpreadsheet className="w-5 h-5" />}
                            </div>
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-slate-800 truncate">{file.name}</h5>
                              <p className="text-[10px] text-slate-400 truncate">ប្រភេទ៖ {file.mimeType}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleImportFile(file)}
                            className="bg-purple-100 hover:bg-purple-900 hover:text-white text-purple-900 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>នាំចូល</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition"
          >
            បិទ
          </button>
        </div>
      </motion.div>
    </div>
  );
};
