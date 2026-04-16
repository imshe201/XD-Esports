// Firebase CDN imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Firebase config (PASTE YOUR VALUES)
const firebaseConfig = {
  apiKey: "AIzaSyAEf0w3pmCfFRoKMcrv-_V-cG1ENK2cotY",
  authDomain: "xd-esports.firebaseapp.com",
  projectId: "xd-esports",
  storageBucket: "xd-esports.firebasestorage.app",
  messagingSenderId: "543232652876",
  appId: "1:543232652876:web:c306b0936a8bb7de3b66e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database reference
const db = getFirestore(app);

export { db };

