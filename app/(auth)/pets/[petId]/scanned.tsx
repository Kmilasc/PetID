import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { usePet } from '~/hooks/queries/pets';
import { useUser } from '~/hooks/queries/users';
import { z } from "zod";
import { Spinner } from "~/components/ui/spinner";

export default function PetDetails() {
  const { petId } = useLocalSearchParams();
  const { data: pet, isLoading: isPetLoading } = usePet(z.string().parse(petId));
  const { data: user, isLoading: isUserLoading } = useUser(pet?.ownerId);

  const isLoading = isPetLoading || isUserLoading;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <Spinner size="lg" className="mb-4" />
        <Text className="text-muted-foreground">Carregando detalhes do pet...</Text>
      </View>
    );
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
        <View className="flex items-center justify-center mb-4">
          <Avatar className="w-32 h-32" alt={`Foto de ${pet.name}`}>
            {pet.photo ? (
              <AvatarImage source={{ uri: pet.photo }} />
            ) : (
              <AvatarFallback>
                <Text className="text-2xl">🐾</Text>
              </AvatarFallback>
            )}
          </Avatar>
        </View>
        <Text className="font-bold text-center text-lg mb-2">{pet.name}</Text>
        <Text>Raça: {pet.breed}</Text>
        <Text>Sexo: {pet.sex}</Text>
        <Text>Vacinas em dia? {pet.vaccinated ? 'Sim' : 'Não'}</Text>
        <Text>Doenças ou alergias: {pet.diseases || 'Nenhuma'}</Text>
        <Text className="mt-3 font-bold">Contato do Tutor</Text>
        <Text>{user?.name || 'Não informado'}</Text>
        <Text>{user?.contact || 'Não informado'}</Text>
      </Card>
    </View>
  );
}