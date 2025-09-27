// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAHKVYhA5g9-rZDHjtJZYMu9JtTbUXcROc",
	authDomain: "gog-react-ts.firebaseapp.com",
	projectId: "gog-react-ts",
	storageBucket: "gog-react-ts.firebasestorage.app",
	messagingSenderId: "820720141127",
	appId: "1:820720141127:web:508f7c3ba270bb55118262",
	measurementId: "G-SFY6D5X0ZR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app); // Export the auth instance
export const db = getFirestore(app); // Export the auth instance
