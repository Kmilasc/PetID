import { useMutation } from '@tanstack/react-query';
import { signOut } from '@react-native-firebase/auth';
import { auth } from '~/services/firebase';
import { useRouter } from 'expo-router';

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await signOut(auth);
    },
    onSuccess: () => {
      router.replace('/');
    },
  });
} 