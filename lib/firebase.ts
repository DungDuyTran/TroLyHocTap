// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCFeNM_hVLlR3o-d2OD53nFM7M3mk53P8E",
  authDomain: "websitethoitrangonline.firebaseapp.com",
  projectId: "websitethoitrangonline",
  storageBucket: "websitethoitrangonline.appspot.com", // ✅ sửa lại thành .appspot.com
  messagingSenderId: "157256364421",
  appId: "1:157256364421:web:6839d7cf7863a7f5e6d4ec",
  measurementId: "G-YYVDB3SYF4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
