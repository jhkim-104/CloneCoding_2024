// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCs4rTbzh5lJQzCP-5CPyrc-d7iafraGD0",
  authDomain: "nwitter-reloaded-c3db7.firebaseapp.com",
  projectId: "nwitter-reloaded-c3db7",
  storageBucket: "nwitter-reloaded-c3db7.appspot.com",
  messagingSenderId: "17530630083",
  appId: "1:17530630083:web:93b51dd61f35fb9fdc9776",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
