import { TouchableOpacity, View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Link } from 'expo-router';
import { pets } from '~/mock/pets';
import { Avatar, AvatarImage } from '~/components/ui/avatar';

export default function MyPets() {
  return (
    <View className="flex-1 bg-white px-4 pt-8 flex items-center flex-col">
        <Text className="text-2xl font-bold text-center mb-6" accessibilityRole="header">
            Meus Pets
        </Text>
        <View className="max-w-sm flex-1 w-full">
            <View className="gap-4 mb-8">
                {pets.map(({ id, photo, name }) => (
                    <Link
                        href={{
                            pathname: "/pet/register",
                            params: {
                                petId: id,
                            }
                        }}
                        asChild
                        key={id}
                    >
                        <TouchableOpacity>
                            <Card className="flex-row items-center p-4 gap-4">
                                <Avatar alt="Avatar" className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-2">
                                    <AvatarImage source={{ uri: photo }} />
                                </Avatar>
                                <CardContent className="flex-1 p-0">
                                    <Text className="text-lg font-semibold" accessibilityLabel={`Nome do pet: ${name}`}>{name}</Text>
                                </CardContent>
                            </Card>
                        </TouchableOpacity>
                    </Link>
                ))}
            </View>
            <Link
                href="/pet/register"
                asChild
            >
                <Button variant="outline" className="w-full" accessibilityLabel="Adicionar novo pet">
                    <Text>+ Adicionar novo pet</Text>
                </Button>
            </Link>
        </View>
    </View>
  );
}