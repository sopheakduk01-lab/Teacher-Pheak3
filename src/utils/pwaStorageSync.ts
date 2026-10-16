/**
 * pwaStorageSync.ts
 * Provides multi-layer persistent storage (IndexedDB + localStorage),
 * Web Share API support for iOS/Android Standalone PWA,
 * and seamless clipboard/text transfer for "Add to Home Screen" environments.
 */

import { exportAllAcademicYearsBackup, importAcademicYearsBackup, AcademicYearDataBundle, loadCompleteYearBundle, saveCompleteYearBundle } from './academicYearStorage';

const IDB_DB_NAME = 'moeys_teacher_admin_db';
const IDB_STORE_NAME = 'teacher_backups';
const IDB_VERSION = 1;

/**
 * Open IndexedDB database safely
 */
function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(IDB_DB_NAME, IDB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save complete backup snapshot to IndexedDB
 */
export async function saveBackupToIndexedDB(backupJson: string): Promise<boolean> {
  try {
    const db = await openIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      store.put(backupJson, 'latest_full_backup');
      store.put(new Date().toISOString(), 'last_saved_time');
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('Could not save to IndexedDB:', err);
    return false;
  }
}

/**
 * Load backup snapshot from IndexedDB
 */
export async function loadBackupFromIndexedDB(): Promise<string | null> {
  try {
    const db = await openIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readonly');
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.get('latest_full_backup');
      req.onsuccess = () => resolve((req.result as string) || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Request browser persistent storage permission (prevents iOS/Android from clearing storage)
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persist();
      console.log(`[Storage] Persistent storage granted: ${isPersisted}`);
      return isPersisted;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Share or download backup JSON file safely across all mobile & desktop environments.
 * Uses Web Share API if available on iOS/Android Standalone PWA.
 */
export async function shareOrDownloadBackupFile(
  teacherName: string,
  onShowToast: (msg: string) => void
): Promise<boolean> {
  try {
    const jsonString = exportAllAcademicYearsBackup();
    // Also save to IndexedDB
    await saveBackupToIndexedDB(jsonString);

    const cleanName = teacherName ? teacherName.replace(/\s+/g, '_') : 'Teacher';
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `MOEYS_Primary_Backup_${cleanName}_${dateStr}.json`;

    // 1. Check Web Share API with files (ideal for iOS Safari, Android, and Add to Home Screen PWA)
    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
      try {
        const file = new File([jsonString], fileName, { type: 'application/json' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'MOEYS Primary Teacher Admin Backup',
            text: `ទិន្នន័យរដ្ឋបាលគ្រូបឋមសិក្សា (${cleanName}) - ${dateStr}`,
            files: [file],
          });
          onShowToast('បានចែករំលែក ឬរក្សាទុកឯកសារ Backup ទៅ Files / Google Drive / Telegram រួចរាល់! 📲✅');
          return true;
        }
      } catch (shareErr: any) {
        // User aborted share or share failed; fallback to download
        if (shareErr.name === 'AbortError') {
          return false;
        }
        console.warn('Web Share file failed, falling back to download:', shareErr);
      }
    }

    // 2. Standard Browser Download fallback
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onShowToast('បានទាញយកឯកសារ Backup (.json) រួចរាល់ដោយសុវត្ថិភាព! 💾');
    return true;
  } catch (err: any) {
    console.error('Export error:', err);
    onShowToast(`មានបញ្ហាក្នុងការបង្កើតឯកសារ Backup: ${err.message || ''}`);
    return false;
  }
}

/**
 * Copy entire backup JSON code to clipboard
 */
export async function copyBackupToClipboard(onShowToast: (msg: string) => void): Promise<boolean> {
  try {
    const jsonString = exportAllAcademicYearsBackup();
    await saveBackupToIndexedDB(jsonString);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(jsonString);
      onShowToast('បានចម្លងកូដ Backup (JSON Code) ទៅ Clipboard រួចរាល់! លោកគ្រូអាចយកទៅ Paste ក្នុង Home Screen App បានភ្លាមៗ 📋✅');
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = jsonString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      onShowToast('បានចម្លងកូដ Backup ទៅ Clipboard! 📋');
      return true;
    }
  } catch (err) {
    console.error(err);
    onShowToast('មិនអាចចម្លងទៅ Clipboard បានទេ។ សូមប្រើវិធីទាញយកឯកសារវិញ!');
    return false;
  }
}

/**
 * Check if the app is currently running in Standalone (Add to Home Screen) mode
 */
export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}
