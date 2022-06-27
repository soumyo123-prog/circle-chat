import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBw4pShntElhZ6DuZhx-vZH_YiwdTSx7ew',
  authDomain: 'circle-chat-fa06c.firebaseapp.com',
  projectId: 'circle-chat-fa06c',
  storageBucket: 'circle-chat-fa06c.appspot.com',
  messagingSenderId: '949467320264',
  appId: '1:949467320264:web:ae53e0d781001c62b0fafd',
  measurementId: 'G-T4DW08QZP8'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
