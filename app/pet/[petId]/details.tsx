import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { View } from "react-native";
import { shareAsync, isAvailableAsync } from 'expo-sharing';
import { useLocalSearchParams } from "expo-router";
import QRCode from 'react-native-qrcode-svg';
import { useQuery } from "@tanstack/react-query";
import QRCodeGenerator from 'qrcode'
import { pets } from '~/mock/pets';

export default function PetDetails() {
  const { petId } = useLocalSearchParams();
  const { data: isAvailableAsyncResult } = useQuery({
    queryKey: ['isAvailableAsync'],
    queryFn: () => isAvailableAsync(),
  })

  const pet = pets.find(({ id }) => id === petId as string);

  const url = `http://localhost:8081/pet/${petId}/scanned`

  const { data: qrCode } = useQuery({
    queryKey: ['qrcode', url],
    queryFn: async () => QRCodeGenerator.toDataURL(url),
  })

  const handleOnShareButtonPress = async () => {
    qrCode && shareAsync(qrCode)
  }
  
  if (!pet) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Pet não encontrado</Text>
      </View>
    );
  }
  
  return (
    <View className="max-w-sm self-center">
        <Text className="text-xl font-bold text-center mt-4 mb-2" accessibilityRole="header">
            Detalhes do Pet
        </Text>
        <Card className="p-4 bg-white rounded-xl shadow-md">
            <Text className="font-bold">{pet.name}</Text>
            <Text>{pet.breed}</Text>
            <Text>{pet.sex}</Text>
            <Text>Vacinas em dia? {pet.isVaccinated ? 'Sim' : 'Não'}</Text>
            <Text>Doenças ou alergias: {pet.diseases || 'Nenhuma'}</Text>
            <Text className="mt-3 font-bold">Contato do Tutor</Text>
            <Text>{pet.contact}</Text>
            <View className="flex items-center justify-center my-4">
                <QRCode value={url} size={140} />
            </View>
        </Card>
        <View className="mx-3 mt-3 mb-6">
            {isAvailableAsyncResult && (
                <Button className="w-full" accessibilityLabel="Compartilhar ou imprimir QR Code" onPress={handleOnShareButtonPress}>
                    <Text>
                        Compartilhar/Imprimir QR Code
                    </Text>
                </Button>
            )}
        </View>
    </View>
  );
}