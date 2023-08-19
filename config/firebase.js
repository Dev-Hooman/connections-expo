import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCn8Qd0_6EZxoZUMi8aVJOJUvVrUVAxoio",
  authDomain: "chat-c6e45.firebaseapp.com",
  projectId: "chat-c6e45",
  storageBucket: "chat-c6e45.appspot.com",
  messagingSenderId: "748847479940",
  appId: "1:748847479940:web:1d8bbc7f921d8fffd456d1",
  measurementId: "G-JFZG1S1JEW"
};

initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();