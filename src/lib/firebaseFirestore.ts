import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, Auth, User } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Ensure Firebase App is initialized before any service retrieval
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Firebase signInWithGoogle error:', error);
    throw error;
  }
}

export async function saveYearBundleToFirestore(userId: string, bundle: any): Promise<void> {
  if (!userId || !bundle) return;
  try {
    const yearKey = (bundle.year || 'default').replace(/\s+/g, '_').replace(/[/\\?%*:|"<>]/g, '-');
    const docRef = doc(db, 'users', userId, 'academic_years', yearKey);
    // Sanitize bundle data for Firestore (remove undefined, huge dataURLs if necessary)
    const cleanBundle = JSON.parse(JSON.stringify(bundle));
    await setDoc(docRef, {
      ...cleanBundle,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving year bundle to Firestore:', error);
    throw error;
  }
}

export async function loadYearBundleFromFirestore(userId: string, year: string): Promise<any | null> {
  if (!userId) return null;
  try {
    const yearKey = (year || 'default').replace(/\s+/g, '_').replace(/[/\\?%*:|"<>]/g, '-');
    const docRef = doc(db, 'users', userId, 'academic_years', yearKey);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error('Error loading year bundle from Firestore:', error);
    return null;
  }
}

export async function loadAllYearsFromFirestore(userId: string): Promise<any[]> {
  if (!userId) return [];
  try {
    const colRef = collection(db, 'users', userId, 'academic_years');
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => d.data());
  } catch (error) {
    console.error('Error loading all years from Firestore:', error);
    return [];
  }
}
