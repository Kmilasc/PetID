import { MaterialIcons } from '@expo/vector-icons';
import { useForm } from '@tanstack/react-form';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useRef } from 'react';
import { z } from 'zod';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, type Option } from '~/components/ui/select';
import { Spinner } from '~/components/ui/spinner';
import { Text } from '~/components/ui/text';
import { usePickImage, useSavePet, useUploadPhoto } from '~/hooks/mutations/pets';
import { usePet } from '~/hooks/queries/pets';

const petSchema = z.object({
  id: z.string().nullable(),
  name: z.string().min(1, 'Nome é obrigatório'),
  breed: z.string().min(1, 'Raça é obrigatória'),
  sex: z.string().min(1, 'Sexo é obrigatório'),
  vaccinated: z.boolean(),
  diseases: z.string(),
  photo: z.string(),
});

export type PetFormData = z.infer<typeof petSchema>;

export default function PetRegister() {
  const { petId } = useLocalSearchParams();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: pet, isLoading } = usePet(petId as string);

  const { mutate: savePet, isPending, error: saveError } = useSavePet(
    (newPetId) => {
      router.replace({
        pathname: "./[petId]/details",
        params: { petId: newPetId }
      });
    }
  );

  const { mutateAsync: uploadPhoto, isPending: isUploadingPhoto, error: uploadError } = useUploadPhoto(
    (base64Image) => {
      form.setFieldValue('photo', base64Image);
    }
  );

  const { mutate: pickImage, isPending: isPickingImage, error: pickError } = usePickImage(
    (uri) => uploadPhoto(uri)
  );

  const form = useForm({
    defaultValues: {
      id: pet?.id || null,
      name: pet?.name || '',
      breed: pet?.breed || '',
      sex: pet?.sex || '',
      vaccinated: pet?.vaccinated || false,
      diseases: pet?.diseases || '',
      photo: pet?.photo,
    },
    validators: {
      onChange: petSchema,
    },
    onSubmit: async ({ value }) => {
      savePet(value);
    },
  });

  const handleOnPickPhotoButtonPress = () => {
    pickImage();
  };

  const error = saveError || uploadError || pickError;

  const handleDiseasesFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Spinner size="lg" className="mb-4" />
        <Text className="text-muted-foreground">Carregando dados do pet...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            flexGrow: 1,
            padding: 16
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          <Card className="w-full mb-8">
            <CardHeader>
              <CardTitle>Cadastro do Pet</CardTitle>
            </CardHeader>
            <CardContent className="gap-4 flex flex-col">
              {error && (
                <Alert variant="destructive" icon={MaterialIcons} iconName="error">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
              <View className="gap-1">
                <Label nativeID="photo">Upload de foto</Label>
                <View className='flex flex-row justify-center'>
                  <Pressable 
                    onPress={handleOnPickPhotoButtonPress}
                    disabled={isPickingImage || isUploadingPhoto}
                  >
                    <Avatar alt="Upload de foto avatar" className='h-32 w-32'>
                      <form.Field
                        name="photo"
                      >
                        {(field) => (
                          <>
                            {field.state.value && <AvatarImage source={{ uri: field.state.value }} />}
                            <AvatarFallback>
                              {isPickingImage || isUploadingPhoto ? (
                                <Spinner size="sm" />
                              ) : (
                                <View className="items-center">
                                  <MaterialIcons name="add-a-photo" size={24} color="#666" />
                                  <Text className="text-xs text-muted-foreground mt-1">Toque para adicionar</Text>
                                </View>
                              )}
                            </AvatarFallback>
                          </>
                        )}
                      </form.Field>
                    </Avatar>
                  </Pressable>
                </View>
              </View>
              <View className="gap-1">
                <Label nativeID="petName">Nome do pet</Label>
                <form.Field
                  name="name"
                >
                  {(field) => (
                    <>
                      <Input
                        aria-labelledby="petName"
                        placeholder="Digite o nome do pet"
                        returnKeyType="next"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.errors && (
                        <Text className="text-red-500 text-sm">
                          {field.state.meta.errors[0]?.message}
                        </Text>
                      )}
                    </>
                  )}
                </form.Field>
              </View>
              <View className="gap-1">
                <Label nativeID="breed">Raça</Label>
                <form.Field
                  name="breed"
                >
                  {(field) => (
                    <>
                      <Input
                        aria-labelledby="breed"
                        placeholder="Digite a raça"
                        returnKeyType="next"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.errors && (
                        <Text className="text-red-500 text-sm">
                          {field.state.meta.errors[0]?.message}
                        </Text>
                      )}
                    </>
                  )}
                </form.Field>
              </View>
              <View className="gap-1">
                <Label nativeID="sex">Sexo</Label>
                <form.Field
                  name="sex"
                >
                  {(field) => (
                    <>
                      <Select
                        value={field.state.value ? { value: field.state.value, label: field.state.value } : undefined}
                        onValueChange={(option: Option | undefined) => {
                          if (option) {
                            field.handleChange(option.value);
                          }
                        }}
                      >
                        <SelectTrigger aria-labelledby="sex">
                          <View className="flex-row items-center gap-2">
                            <MaterialIcons 
                              name={field.state.value === "Macho" ? "male" : field.state.value === "Fêmea" ? "female" : "person"} 
                              size={20} 
                              color="#666"
                            />
                            <SelectValue placeholder="Selecione o sexo" />
                          </View>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Macho" label="♂️ Macho" />
                          <SelectItem value="Fêmea" label="♀️ Fêmea" />
                        </SelectContent>
                      </Select>
                      {field.state.meta.errors && (
                        <Text className="text-red-500 text-sm">
                          {field.state.meta.errors[0]?.message}
                        </Text>
                      )}
                    </>
                  )}
                </form.Field>
              </View>
              <View className="flex-row items-center gap-2">
                <Label nativeID="vaccinated">Vacinas em dia?</Label>
                <form.Field
                  name="vaccinated"
                >
                  {(field) => (
                    <Checkbox
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked as boolean)}
                      aria-labelledby="vaccinated"
                    />
                  )}
                </form.Field>
              </View>
              <View className="gap-1">
                <Label nativeID="diseases">Doenças ou alergias</Label>
                <form.Field
                  name="diseases"
                >
                  {(field) => (
                    <>
                      <Input
                        aria-labelledby="diseases"
                        placeholder="Descreva se houver"
                        returnKeyType="next"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        onFocus={handleDiseasesFocus}
                      />
                      {field.state.meta.errors && (
                        <Text className="text-red-500 text-sm">
                          {field.state.meta.errors[0]?.message}
                        </Text>
                      )}
                    </>
                  )}
                </form.Field>
              </View>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <form.Subscribe
                selector={(state) => ({
                  isSubmitting: state.isSubmitting,
                  canSubmit: state.canSubmit,
                })}
              >
                {(state) => (
                  <Button
                    disabled={!state.canSubmit || state.isSubmitting || isPending || isPickingImage || isUploadingPhoto}
                    className="w-full"
                    onPress={() => form.handleSubmit()}
                  >
                    {isPending || isPickingImage || isUploadingPhoto ? (
                      <View className="flex-row items-center gap-2">
                        <Spinner size="sm" />
                        <Text>
                          {isPending 
                            ? 'Salvando...' 
                            : isPickingImage 
                              ? 'Selecionando imagem...'
                              : 'Enviando imagem...'}
                        </Text>
                      </View>
                    ) : (
                      <Text>
                        {state.isSubmitting 
                          ? 'Validando...' 
                          : 'Salvar cadastro'}
                      </Text>
                    )}
                  </Button>
                )}
              </form.Subscribe>
            </CardFooter>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}