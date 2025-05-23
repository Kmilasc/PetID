import { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Link, useLocalSearchParams } from 'expo-router';
import { pets } from '~/mock/pets';

export default function PetRegister() {
  const { petId } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    sex: '',
    vaccinated: false,
    diseases: '',
    contact: '',
    photo: null as string | null,
  });

  const pet = pets.find(({ id }) => id === petId as string);

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        breed: pet.breed || '',
        sex: pet.sex || '',
        vaccinated: pet.isVaccinated || false,
        diseases: pet.diseases || '',
        contact: pet.contact || '',
        photo: pet.photo || null,
      });
    }
  }, [pet]);

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleOnPickPhotoButtonPress = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleInputChange('photo', result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
        <ScrollView className='p-4'>
            <Card className="w-full mb-8">
                <CardHeader>
                    <CardTitle>Cadastro do Pet</CardTitle>
                </CardHeader>
                <CardContent className="gap-4 flex flex-col">
                    <View className="gap-1">
                        <Label nativeID="petName">Nome do pet</Label>
                        <Input
                            aria-labelledby="petName"
                            placeholder="Digite o nome do pet"
                            returnKeyType="next"
                            value={formData.name}
                            onChangeText={(value) => handleInputChange('name', value)}
                        />
                    </View>
                    <View className="gap-1">
                        <Label nativeID="breed">Raça</Label>
                        <Input
                            aria-labelledby="breed"
                            placeholder="Digite a raça"
                            returnKeyType="next"
                            value={formData.breed}
                            onChangeText={(value) => handleInputChange('breed', value)}
                        />
                    </View>
                    <View className="gap-1">
                        <Label nativeID="sex">Sexo</Label>
                        <Input
                            aria-labelledby="sex"
                            placeholder="Macho ou Fêmea"
                            returnKeyType="next"
                            value={formData.sex}
                            onChangeText={(value) => handleInputChange('sex', value)}
                        />
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Label nativeID="vaccinated">Vacinas em dia?</Label>
                        <Checkbox
                            checked={formData.vaccinated}
                            onCheckedChange={(checked) => handleInputChange('vaccinated', checked as boolean)}
                            aria-labelledby="vaccinated"
                        />
                    </View>
                    <View className="gap-1">
                        <Label nativeID="diseases">Doenças ou alergias</Label>
                        <Input
                            aria-labelledby="diseases"
                            placeholder="Descreva se houver"
                            returnKeyType="next"
                            value={formData.diseases}
                            onChangeText={(value) => handleInputChange('diseases', value)}
                        />
                    </View>
                    <View className="gap-1">
                        <Label nativeID="contact">Contato do tutor</Label>
                        <Input
                            aria-labelledby="contact"
                            placeholder="Telefone ou email"
                            keyboardType="email-address"
                            returnKeyType="done"
                            value={formData.contact}
                            onChangeText={(value) => handleInputChange('contact', value)}
                        />
                    </View>
                    <View className="gap-1">
                        <Label nativeID="photo">Upload de foto</Label>
                        <View className='flex flex-row justify-center'>
                            <Avatar alt="Upload de foto avatar" className='h-20 w-20'>
                                {formData.photo && <AvatarImage source={{ uri: formData.photo }} />}
                                <AvatarFallback>
                                    <Text>PH</Text>
                                </AvatarFallback>
                            </Avatar>
                        </View>
                        <Button variant="outline" onPress={handleOnPickPhotoButtonPress}>
                            <Text>Selecionar foto</Text>
                        </Button>
                    </View>
                </CardContent>
                <CardFooter>
                    <Link
                        href={{
                            pathname: "./[petId]/details",
                            params: {
                                petId: petId,
                            }
                        }}
                        asChild
                        disabled={!petId}
                    >
                        <Button className="w-full">
                            <Text>SALVAR</Text>
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}