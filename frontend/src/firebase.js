import { initializeApp } from 'firebase/app';
import { FacebookAuthProvider, getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC26pDfvMI5ctfKXr3jH_lLhQwiwVnvTak",
  authDomain: "airbnb-382f8.firebaseapp.com",
  projectId: "airbnb-382f8",
  storageBucket: "airbnb-382f8.appspot.com",
  messagingSenderId: "716767923821",
  appId: "1:716767923821:web:7e129106dcb6493f0d7964"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
