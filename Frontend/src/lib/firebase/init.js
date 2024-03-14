import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig, "shopping app");
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const storage = getStorage(app);

auth.useDeviceLanguage();
provider.setDefaultLanguage();

provider.addScope("https://www.googleapis.com/auth/userinfo.email");
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

export { auth, provider, storage };
