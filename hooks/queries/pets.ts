import { collection, query, where, getDocs, doc, getDoc } from '@react-native-firebase/firestore';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { db, auth } from '~/services/firebase';

const datePreprocess = (val: any) => {
  if (val && typeof val === 'object' && 'toDate' in val) {
    return val.toDate();
  }
  return val;
};

export const petSchema = z.object({
  id: z.string(),
  name: z.string(),
  breed: z.string(),
  sex: z.string(),
  vaccinated: z.boolean(),
  diseases: z.string().optional(),
  photo: z.string(),
  ownerId: z.string(),
  createdAt: z.preprocess(datePreprocess, z.date()),
  updatedAt: z.preprocess(datePreprocess, z.date()),
});

export type Pet = z.infer<typeof petSchema>;

export const petQueryOptions = queryOptions({
  queryKey: ['pets'],
  queryFn: async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('Usuário não autenticado');

      const petsRef = collection(db, 'pets');
      const q = query(petsRef, where('ownerId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const pets = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        const validatedPet = petSchema.parse({ id: doc.id, ...data });
        return validatedPet;
      });

      return pets;
    } catch (error) {
      console.log(error)
      if (error instanceof z.ZodError) {
        throw new Error('Dados do pet inválidos: ' + error.message);
      }
      throw new Error('Erro ao buscar pets');
    }
  },
});

export function usePets() {
  return useQuery(petQueryOptions);
}

export function usePet(petId: string) {
  return useQuery({
    queryKey: ['pet', petId],
    queryFn: async () => {
      const petDoc = await getDoc(doc(db, 'pets', petId));
      
      if (!petDoc.exists()) {
        throw new Error('Pet não encontrado');
      }

      const data = petDoc.data();

      return petSchema.parse({ id: petDoc.id, ...data });
    },
    enabled: !!petId,
  });
} 