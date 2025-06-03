import { auth } from '~/services/firebase';
import { onAuthStateChanged, type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useLinkingURL,  } from 'expo-linking';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();
  const isAlreadyReplaced = useRef(false);
  const isAlreadyScanned = useRef(false);
  const linkingURL = useLinkingURL();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      isAlreadyReplaced.current = false;

      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isAlreadyReplaced.current) return;

    if (linkingURL && !isAlreadyScanned.current) {
      router.replace(linkingURL);
      isAlreadyScanned.current = true;
      isAlreadyReplaced.current = true;

      return;
    }

    if (isLoading) return;

    isAlreadyReplaced.current = true;

    if (!user) {
      router.replace('/');
      return;
    }

    router.replace('/pets');
  }, [user, segments, isLoading, router, linkingURL]);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 