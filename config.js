import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";







const firebaseConfig = {
    apiKey: "AIzaSyDm1JHPqrDgqA8vwsH89LJa-FT6SNK9KUU",
    authDomain: "owaisds-todo.firebaseapp.com",
    projectId: "owaisds-todo",
    storageBucket: "owaisds-todo.appspot.com",
    messagingSenderId: "590222794495",
    appId: "1:590222794495:web:04e510a1fc66471409f6ca",
    measurementId: "G-GG2L656E17"
  };



export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
