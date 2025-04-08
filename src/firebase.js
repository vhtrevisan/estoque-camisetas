import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYKX8jYFOA_FDkiVxbdMZpzTbZwV0lTX0",
  authDomain: "estoque-camisetas.firebaseapp.com",
  projectId: "estoque-camisetas",
  storageBucket: "estoque-camisetas.firebasestorage.app",
  messagingSenderId: "378692484011",
  appId: "1:378692484011:web:42a3db8d4ba49da973b0ee",
  measurementId: "G-GN1GRCBR6J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };