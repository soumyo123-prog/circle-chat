import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState
} from 'react';
import { toast } from 'react-toastify';

import { auth, db } from './firebase';

export interface ChatUserInfo extends User {
  readonly username: string;
}

const AuthContext = createContext<{
  user: ChatUserInfo | null;
  register: (email: string, username: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
}>({
  user: null,
  register: (email: string, username: string, password: string) => {},
  login: (email: string, password: string) => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<ChatUserInfo | null>(null);

  const requireUsernameToBeUnique = async (username: string) => {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      throw new Error('A user with username ' + username + ' already exists.');
    });
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      await requireUsernameToBeUnique(username);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, 'users', email), {
        username: username
      });
      setUser({ ...userCredential.user, username: username });
    } catch (error: any) {
      toast.error(error.message);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const docSnap = await getDoc(doc(db, 'users', email));
      if (docSnap.exists()) {
        const username = docSnap.data().username;
        setUser({ ...userCredential.user, username: username });
      }
    } catch (error: any) {
      toast.error(error.message);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, 'users', user.email!));
        if (docSnap.exists()) {
          const username = docSnap.data().username;
          setUser({ ...user, username: username });
        }
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        register: register,
        login: login,
        logout: logout
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
