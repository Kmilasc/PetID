import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { pets } from '~/mock/pets';

export default function PetDetails() {
  const { petId } = useLocalSearchParams();
  
  const pet = pets.find(({ id }) => id === petId as string);

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
        </Card>
    </View>
  );
}