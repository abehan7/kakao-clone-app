import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";

interface ICurrentUser {
  displayName: string;
  photoURL: string;
  uid: string;
  email: string;
}

interface State {
  currentUser: ICurrentUser | null;
  signup: (email: string, password: string) => void;
  signin: (email: string, password: string) => void;
  signout: () => void;
  loading: boolean;
}

const AuthContext = createContext<State | null>(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const signup = (email: string, password: string): void => {};
  // createUserWithEmailAndPassword(auth, email, password);
  const signin = (email: string, password: string): void => {};
  // signInWithEmailAndPassword(auth, email, password);
  const signout = (): void => {};
  //   signOut(auth);

  useEffect(() => {
    // const unsubscribe = auth.onAuthStateChanged((user) => {
    //   setCurrentUser(user);
    //   setLoading(false);
    // });
    // return unsubscribe;
  }, []);

  const value: State = { currentUser, signup, signin, signout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
