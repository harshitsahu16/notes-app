import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAq39MQRQDcWD7WhL9zjJ3i434A0QErF5o",
    authDomain: "notes-app-ea70d.firebaseapp.com",
    projectId: "notes-app-ea70d",
    storageBucket: "notes-app-ea70d.appspot.com",
    messagingSenderId: "953355963652",
    appId: "1:953355963652:web:6c777ab798e68c7f0ad451",
    measurementId: "G-SR7CN2YX9T"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  export { db };
