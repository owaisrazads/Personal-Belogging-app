import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";








const firebaseConfig = {
  apiKey: "AIzaSyDzQ8cf_2e6C8jX9VfB8JEoU4nhfQCpERM",
  authDomain: "haseeb-blog-app.firebaseapp.com",
  projectId: "haseeb-blog-app",
  storageBucket: "haseeb-blog-app.appspot.com",
  messagingSenderId: "786862414304",
  appId: "1:786862414304:web:7def9e6d23e05715b1b385",
  measurementId: "G-R1XC2VLKEQ"
};



export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);