import { auth, googleProvider, signInWithPopup, signOut } from './firebaseFirestore';
import { onAuthStateChanged, User, GoogleAuthProvider } from 'firebase/auth';

let cachedAccessToken: string | null = sessionStorage.getItem('gdrive_access_token');

export function initAuth(
  onSuccess: (user: User, token: string) => void,
  onSignedOut: () => void
): () => void {
  return onAuthStateChanged(auth, async (user) => {
    if (user && cachedAccessToken) {
      onSuccess(user, cachedAccessToken);
    } else {
      onSignedOut();
    }
  });
}

export async function googleSignIn(): Promise<{ user: User; accessToken: string } | null> {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.addScope('https://www.googleapis.com/auth/drive.readonly');

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || '';

    if (accessToken) {
      cachedAccessToken = accessToken;
      sessionStorage.setItem('gdrive_access_token', accessToken);
    }

    return {
      user: result.user,
      accessToken,
    };
  } catch (err) {
    console.error('Google Drive sign-in error:', err);
    throw err;
  }
}

export async function getAccessToken(): Promise<string | null> {
  return cachedAccessToken || sessionStorage.getItem('gdrive_access_token');
}

export async function logout(): Promise<void> {
  cachedAccessToken = null;
  sessionStorage.removeItem('gdrive_access_token');
  await signOut(auth);
}
