import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC_gcb-Lk-vLhyEAgs10OCP6klnqOHLZFo",
  authDomain: "telegram-clone-yt-4843c.firebaseapp.com",
  projectId: "telegram-clone-yt-4843c",
  storageBucket: "telegram-clone-yt-4843c.appspot.com",
  messagingSenderId: "243718972317",
  appId: "1:243718972317:web:d1a55cac0fa27e39ad4574",
  measurementId: "G-0EVNPC4R47",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(app);
export const storage = getStorage(app);
