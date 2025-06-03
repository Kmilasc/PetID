import { doc, getDoc } from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { db } from '~/services/firebase';

const datePreprocess = (val: any) => {
  if (val && typeof val === 'object' && 'toDate' in val) {
    return val.toDate();
  }
  return val;
};

export const userSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  contact: z.string()
    .min(1, 'Telefone é obrigatório')
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato inválido. Use (99) 99999-9999'),
  updatedAt: z.preprocess(datePreprocess, z.date()),
});

export type User = z.infer<typeof userSchema>;

export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('Usuário não autenticado');

      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return userSchema.parse(data);
    },
  });
} 