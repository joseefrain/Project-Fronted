// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBxCBgWp4CHEU0EeaZf5BgxUO39LcTbQ7U",
  authDomain: "store-efrain.firebaseapp.com",
  projectId: "store-efrain",
  storageBucket: "store-efrain.firebasestorage.app",
  messagingSenderId: "1019973608645",
  appId: "1:1019973608645:web:6ff8f930f97c5122ddbcac",
  measurementId: "G-3D5XGGGV9T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };