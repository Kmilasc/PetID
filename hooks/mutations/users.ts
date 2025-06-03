import { doc, setDoc } from '@react-native-firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { db, auth } from '~/services/firebase';

export const userSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  contact: z.string()
    .min(1, 'Telefone é obrigatório')
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato inválido. Use (99) 99999-9999'),
});

export type UserFormData = z.infer<typeof userSchema>;

export const useSaveUserProfile = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserFormData) => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('Usuário não autenticado');

        const userDoc = doc(db, 'users', userId);
        
        await setDoc(userDoc, {
          ...data,
          updatedAt: new Date(),
        }, { merge: true });

        return userId;
      } catch {
        throw new Error('Erro ao salvar perfil');
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      onSuccess?.();
    },
  });
}; 