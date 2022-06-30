import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';

import * as constants from '../../constants';

let firebaseConfig = {
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
export const firestore = getFirestore(app);
export const database = getDatabase(app);

if (constants.DEVELOPMENT_MODE) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  connectDatabaseEmulator(database, 'localhost', 9000);
}
