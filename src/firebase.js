
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBOnqJ8ARAK0h-6371Lfk5ItxibnHKuwKs",
    authDomain: "penpals-191ae.firebaseapp.com",
    projectId: "penpals-191ae",
    storageBucket: "penpals-191ae.appspot.com",
    messagingSenderId: "604628916204",
    appId: "1:604628916204:web:0c8f7e73ad320bb13bd2c9"
  }
  


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore(app)