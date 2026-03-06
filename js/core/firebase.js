// Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

// Firebase services we will use
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAilqBdrUFu8cQDVIy3iuY8FkTT7zupv_M",
  authDomain: "job-finder-app-acdff.firebaseapp.com",
  projectId: "job-finder-app-acdff",
  storageBucket: "job-finder-app-acdff.firebasestorage.app",
  messagingSenderId: "375109124066",
  appId: "1:375109124066:web:21f6e33d546983346cc3bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

