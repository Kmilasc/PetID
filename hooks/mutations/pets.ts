import { collection, doc, serverTimestamp, setDoc, deleteDoc } from '@react-native-firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { z } from 'zod';
import { db, auth } from '~/services/firebase';
import { petQueryOptions } from '~/hooks/queries/pets';
import { PetFormData } from '~/app/(auth)/pets/register';

export const useSavePet = (onSuccess: (newPetId: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data}: PetFormData) => {
      try {
        const petsRef = collection(db, 'pets');
        const petDoc = typeof id === 'string' ? doc(petsRef, id) : doc(petsRef);
        
        await setDoc(petDoc, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ownerId: z.string().parse(auth.currentUser!.uid),
        });

        return petDoc.id;
      } catch {
        throw new Error('Erro ao salvar pet');
      }
    },
    onSuccess: async (newPetId) => {
      await queryClient.invalidateQueries(petQueryOptions);
      onSuccess(newPetId);
    },
  });
};

export const useDeletePet = (onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (petId: string) => {
      try {
        const petIdParsed = z.string().parse(petId);
        const petDoc = doc(db, 'pets', petIdParsed);
        await deleteDoc(petDoc);
      } catch {
        throw new Error('Erro ao deletar pet');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(petQueryOptions);
      onSuccess();
    },
  });
};

export const useUploadPhoto = (onSuccess: (base64Image: string) => void) => {
  return useMutation({
    mutationFn: async (uri: string) => {
      try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        return `data:image/jpeg;base64,${base64}`;
      } catch {
        throw new Error('Erro ao processar imagem');
      }
    },
    onSuccess,
  });
};

export const usePickImage = (onSuccess: (uri: string) => void) => {
  return useMutation({
    mutationFn: async () => {
      try {
        const result = await launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
        });

        if (result.canceled) {
          throw new Error('Seleção de imagem cancelada');
        }

        return result.assets[0].uri;
      } catch {
        throw new Error('Erro ao selecionar imagem');
      }
    },
    onSuccess,
  });
}; 