import { useMutation } from "@tanstack/react-query";
import { shareAsync } from 'expo-sharing';
import ViewShot from "react-native-view-shot";
import { Pet } from "~/hooks/queries/pets";

export const useSharePet = () => {
  return useMutation({
    mutationFn: async ({ viewShotRef, pet }: { viewShotRef: ViewShot | null, pet: Pet }) => {
      if (!viewShotRef?.capture) throw new Error('Erro ao compartilhar QR Code');
      
      try {
        const uri = await viewShotRef.capture?.();

        await shareAsync(uri, {
          dialogTitle: `Compartilhar ${pet.name}`,
          mimeType: 'image/png',
          UTI: 'public.png',
        });
      } catch {
        throw new Error('Erro ao compartilhar QR Code');
      }
    },
  });
}; 