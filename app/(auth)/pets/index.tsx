import { TouchableOpacity, View, ScrollView } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Link } from 'expo-router';
import { Avatar, AvatarImage } from '~/components/ui/avatar';
import { useLogout } from '~/hooks/mutations/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { usePets } from '~/hooks/queries/pets';
import { Spinner } from '~/components/ui/spinner';

export default function MyPets() {
  const { mutate: handleLogout, isPending } = useLogout();
  const { data: pets, isLoading, isError, refetch } = usePets();

  return (
    <View className="flex-1 bg-white px-4 pt-8 flex items-center flex-col">
        <View className="w-full flex-row justify-between items-center mb-6">
            <View className="flex-row items-center gap-2">
                <MaterialIcons name="pets" size={28} color="#4F46E5" />
                <Text className="text-2xl font-bold" accessibilityRole="header">
                    Meus Pets
                </Text>
            </View>
            <View className="flex-row gap-2">
                <Link href="/profile" asChild>
                    <Button 
                        variant="outline" 
                        size="sm"
                        accessibilityLabel="Ver dados pessoais"
                        className="flex-row items-center gap-2"
                    >
                        <MaterialIcons name="person" size={20} color="#4F46E5" />
                        <Text>Perfil</Text>
                    </Button>
                </Link>
                <Button 
                    variant="destructive" 
                    size="sm"
                    onPress={() => handleLogout()}
                    disabled={isPending}
                    accessibilityLabel="Sair da conta"
                    className="flex-row items-center gap-2"
                >
                    <MaterialIcons name="logout" size={20} color="white" />
                    <Text>{isPending ? 'Saindo...' : 'Sair'}</Text>
                </Button>
            </View>
        </View>
        <View className="max-w-sm flex-1 w-full flex flex-col gap-4">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="gap-4 flex-1">
                    {isError ? (
                      <View className="items-center justify-center py-8">
                        <MaterialIcons name="error-outline" size={48} color="#EF4444" className="mb-4" />
                        <Text className="text-center text-destructive font-semibold mb-2" accessibilityRole="alert">
                          Ocorreu um erro ao carregar seus pets.
                        </Text>
                        <Button
                          variant="outline"
                          onPress={() => refetch()}
                          accessibilityLabel="Tentar novamente carregar pets"
                        >
                          <Text>Tentar novamente</Text>
                        </Button>
                      </View>
                    ) : isLoading ? (
                        <View className="items-center justify-center py-8">
                            <Spinner size="lg" className="mb-4" />
                            <Text className="text-muted-foreground">Carregando seus pets...</Text>
                        </View>
                    ) : pets?.length === 0 ? (
                        <View className="items-center justify-center py-8">
                            <MaterialIcons name="pets" size={64} color="#9CA3AF" className="mb-4" />
                            <Text className="text-center text-lg mb-2">Você ainda não tem pets cadastrados</Text>
                            <Text className="text-center text-muted-foreground">Que tal adicionar seu primeiro amiguinho? 🐾</Text>
                        </View>
                    ) : (
                        pets?.map(({ id, photo, name }) => (
                            <Link
                                href={{
                                    pathname: "/pets/[petId]/details",
                                    params: {
                                        petId: id,
                                    }
                                }}
                                asChild
                                key={id}
                            >
                                <Card className="flex-row items-center p-4 gap-4 hover:bg-gray-50">
                                    <Avatar alt="Avatar" className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-2">
                                        <AvatarImage source={{ uri: photo }} />
                                    </Avatar>
                                    <CardContent className="flex-1 p-0">
                                        <Text className="text-lg font-semibold" accessibilityLabel={`Nome do pet: ${name}`}>{name}</Text>
                                    </CardContent>
                                    <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                                </Card>
                            </Link>
                        ))
                    )}
                </View>
            </ScrollView>
            {!isLoading && !isError && (
              <View className="gap-4">
                  <Link
                      href="/pets/register"
                      asChild
                  >
                      <Button variant="outline" className="w-full" accessibilityLabel="Adicionar novo pet">
                          <Text className="ml-2">Adicionar novo pet</Text>
                      </Button>
                  </Link>
              </View>
            )}
        </View>
    </View>
  );
}