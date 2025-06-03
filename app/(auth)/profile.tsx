import { MaterialIcons } from '@expo/vector-icons';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Spinner } from '~/components/ui/spinner';
import { Text } from '~/components/ui/text';
import { useAuth } from '~/hooks/auth';
import { useSaveUserProfile, UserFormData, userSchema } from '~/hooks/mutations/users';
import { useUser } from '~/hooks/queries/users';

export type ProfileFormData = UserFormData;

export default function Profile() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const { data: user, isLoading } = useUser(authUser?.uid);

  const { mutate: saveProfile, isPending, error: saveError } = useSaveUserProfile(
    () => {
      router.back();
    }
  );

  const form = useForm({
    defaultValues: {
      name: user?.name || '',
      contact: user?.contact || '',
    },
    validators: {
      onChange: userSchema,
    },
    onSubmit: async ({ value }) => {
      saveProfile(value);
    },
  });

  const formatPhoneNumber = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Spinner size="lg" className="mb-4" />
        <Text className="text-muted-foreground">Carregando dados do perfil...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className='w-full flex-1 p-4'>
        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent className="gap-4 flex flex-col">
            {saveError && (
              <Alert variant="destructive" icon={MaterialIcons} iconName="error">
                <AlertDescription>{saveError.message}</AlertDescription>
              </Alert>
            )}
            <View className="gap-1">
              <Label nativeID="name">Nome</Label>
              <form.Field
                name="name"
              >
                {(field) => (
                  <>
                    <Input
                      aria-labelledby="name"
                      placeholder="Seu nome completo"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      maxLength={100}
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
              <Label nativeID="contact">Telefone</Label>
              <form.Field
                name="contact"
              >
                {(field) => (
                  <>
                    <Input
                      aria-labelledby="contact"
                      placeholder="(99) 99999-9999"
                      keyboardType="phone-pad"
                      returnKeyType="done"
                      value={field.state.value}
                      onChangeText={(text) => {
                        const formatted = formatPhoneNumber(text);
                        field.handleChange(formatted);
                      }}
                      onBlur={field.handleBlur}
                      maxLength={15}
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
                  disabled={!state.canSubmit || state.isSubmitting || isPending}
                  className="w-full"
                  onPress={() => form.handleSubmit()}
                >
                  {isPending ? (
                    <View className="flex-row items-center gap-2">
                      <Spinner size="sm" />
                      <Text>Salvando...</Text>
                    </View>
                  ) : (
                    <Text>
                      {state.isSubmitting 
                        ? 'Validando...' 
                        : 'Salvar perfil'}
                    </Text>
                  )}
                </Button>
              )}
            </form.Subscribe>
          </CardFooter>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
