// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-kids-story-generator-aa327.firebaseapp.com",
  projectId: "ai-kids-story-generator-aa327",
  storageBucket: "ai-kids-story-generator-aa327.firebasestorage.app",
  messagingSenderId: "784872295480",
  appId: "1:784872295480:web:39bb71f320aa01d3e96acd",
  measurementId: "G-5N6PEF96E4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app)