import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs,
  enableIndexedDbPersistence 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { AcademicYearDataBundle } from '../utils/academicYearStorage';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enable offline persistence for Firestore if supported
if (typeof window !== 'undefined') {
  try {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence not supported in this browser');
      }
    });
  } catch (e) {
    console.warn('IndexedDB persistence init:', e);
  }
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

/**
 * Sanitize year string for document ID (e.g., '២០២៥ - ២០២៦' -> 'year_2025_to_2026')
 */
function sanitizeYearDocId(year: string): string {
  if (!year) return 'current_year';
  const khmerToLatin: Record<string, string> = {
    '០': '0', '១': '1', '២': '2', '៣': '3', '៤': '4',
    '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9'
  };
  const latinized = year.replace(/[០-៩]/g, (digit) => khmerToLatin[digit] || digit);
  const clean = latinized.trim().replace(/\s*-\s*/g, '_to_').replace(/[^\w\d\-_]/g, '_');
  return `year_${clean}`.replace(/_+/g, '_');
}

/**
 * Recursively removes undefined fields from an object/array so Firestore setDoc does not throw
 */
function removeUndefinedFields(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefinedFields(item));
  }
  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        result[key] = removeUndefinedFields(value);
      }
    }
    return result;
  }
  return obj;
}

/**
 * Save complete year bundle to Firestore
 */
export async function saveYearBundleToFirestore(
  userId: string,
  bundle: AcademicYearDataBundle
): Promise<boolean> {
  if (!userId || !bundle) return false;
  try {
    const yearId = sanitizeYearDocId(bundle.year);
    const docRef = doc(db, 'teachers', userId, 'years', yearId);
    
    // Clean any undefined fields for Firestore
    const rawPayload = {
      userId,
      year: bundle.year,
      teacher: bundle.teacher || {},
      students: bundle.students || [],
      attendance: bundle.attendance || {},
      grades: bundle.grades || {},
      logbook: bundle.logbook || [],
      inventory: bundle.inventory || [],
      plc: bundle.plc || [],
      quizzes: bundle.quizzes || [],
      libraryBooks: bundle.libraryBooks || [],
      subScores: bundle.subScores || {},
      priFormData: bundle.priFormData || null,
      priLiveSyncActive: bundle.priLiveSyncActive ?? null,
      updatedAt: bundle.updatedAt || new Date().toISOString(),
      lastModified: bundle.lastModified || Date.now()
    };

    const payload = removeUndefinedFields(rawPayload);

    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (error) {
    console.error('Save to Firestore error:', error);
    return false;
  }
}

/**
 * Load complete year bundle from Firestore
 */
export async function loadYearBundleFromFirestore(
  userId: string,
  year: string
): Promise<AcademicYearDataBundle | null> {
  if (!userId) return null;
  try {
    const yearId = sanitizeYearDocId(year);
    const docRef = doc(db, 'teachers', userId, 'years', yearId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      return {
        year: data.year || year,
        teacher: data.teacher,
        students: data.students || [],
        attendance: data.attendance || {},
        grades: data.grades || {},
        logbook: data.logbook || [],
        inventory: data.inventory || [],
        plc: data.plc || [],
        quizzes: data.quizzes || [],
        libraryBooks: data.libraryBooks || [],
        subScores: data.subScores || undefined,
        priFormData: data.priFormData || undefined,
        priLiveSyncActive: data.priLiveSyncActive !== null ? data.priLiveSyncActive : undefined,
        updatedAt: data.updatedAt,
        lastModified: data.lastModified
      };
    }
    return null;
  } catch (error) {
    console.error('Load from Firestore error:', error);
    return null;
  }
}

/**
 * Load all academic year bundles from Firestore for a user
 */
export async function loadAllYearsFromFirestore(
  userId: string
): Promise<AcademicYearDataBundle[]> {
  if (!userId) return [];
  try {
    const yearsCol = collection(db, 'teachers', userId, 'years');
    const snap = await getDocs(yearsCol);
    const bundles: AcademicYearDataBundle[] = [];

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      bundles.push({
        year: data.year,
        teacher: data.teacher,
        students: data.students || [],
        attendance: data.attendance || {},
        grades: data.grades || {},
        logbook: data.logbook || [],
        inventory: data.inventory || [],
        plc: data.plc || [],
        quizzes: data.quizzes || [],
        libraryBooks: data.libraryBooks || []
      });
    });

    return bundles;
  } catch (error) {
    console.error('Load all years error:', error);
    return [];
  }
}
