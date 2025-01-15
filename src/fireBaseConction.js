import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAV91Ummf_sjrKgGiQTh1xkwp4Wx-lMi9Q",
  authDomain: "teste-7198e.firebaseapp.com",
  projectId: "teste-7198e",
  storageBucket: "teste-7198e.firebasestorage.app",
  messagingSenderId: "760098199505",
  appId: "1:760098199505:web:ee712126ef3458ada132f0",
  measurementId: "G-S1LDM455NS",
};

const firebaseApp = initializeApp(firebaseConfig);

export const Db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
