import { Link } from "expo-router";
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { auth } from "~/services/firebase";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { MaterialIcons } from '@expo/vector-icons';

const firebaseErrorSchema = z.object({
    code: z.enum([
        'auth/invalid-email',
        'auth/user-disabled',
        'auth/user-not-found',
        'auth/wrong-password',
        'auth/too-many-requests',
        'auth/network-request-failed',
        'auth/invalid-credential'
    ]),
    message: z.string()
});

type FirebaseError = z.infer<typeof firebaseErrorSchema>;

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const getErrorMessage = (error: FirebaseError): string => {
    const errorMessages: Record<FirebaseError['code'], string> = {
        'auth/invalid-email': 'Email inválido',
        'auth/user-disabled': 'Usuário desativado',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
        'auth/invalid-credential': 'Email ou senha inválidos',
    };

    return errorMessages[error.code] || 'Erro ao fazer login';
};

export default function Login() {
    const { mutate: login, isPending, error } = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            try {
                const { user } = await signInWithEmailAndPassword(auth, email, password);
                return user;
            } catch (error) {
                const parsedError = firebaseErrorSchema.safeParse(error);

                if (parsedError.success) {
                    throw new Error(getErrorMessage(parsedError.data));
                }
                
                throw new Error('Erro inesperado ao fazer login');
            }
        },
    });

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validators: {
            onChange: loginSchema,
        },
        onSubmit: async ({ value }) => {
            login(value);
        },
    });

    return (
        <View className="flex-1">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <ScrollView 
                    style={{ flex: 1 }}
                    contentContainerStyle={{ 
                        flexGrow: 1,
                        padding: 16
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                >
                    <View className="flex-1 justify-center">
                        <Card className="w-full max-w-sm mx-auto">
                            <CardHeader>
                                <CardTitle>Entrar agora!</CardTitle>
                                <CardDescription>
                                    Entre na sua conta e comece a cadastrar seus pets.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='gap-4 native:gap-2 flex flex-col'>
                                {error && (
                                    <Alert variant="destructive" icon={MaterialIcons} iconName="error">
                                        <AlertDescription>{error.message}</AlertDescription>
                                    </Alert>
                                )}
                                <View className='gap-1'>
                                    <Label nativeID='email'>Email</Label>
                                    <form.Field
                                        name="email"
                                    >
                                        {(field) => (
                                            <>
                                                <Input
                                                    aria-aria-labelledby='email'
                                                    keyboardType="email-address"
                                                    textContentType="emailAddress"
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
                                <View className='gap-1'>
                                    <Label nativeID='password'>Senha</Label>
                                    <form.Field
                                        name="password"
                                    >
                                        {(field) => (
                                            <>
                                                <Input
                                                    id='password'
                                                    textContentType="password"
                                                    secureTextEntry
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
                                <Link href="/signup" asChild>
                                    <Button variant="link" className="w-full">
                                        <Text>Não tem uma conta? então crie uma.</Text>
                                    </Button>
                                </Link>
                            </CardContent>
                            <CardFooter>
                                <form.Subscribe
                                    selector={(state) => ({
                                        isSubmitting: state.isSubmitting,
                                        canSubmit: state.canSubmit,
                                    })}
                                >
                                    {(state) => (
                                        <Button
                                            onPress={() => form.handleSubmit()}
                                            disabled={!state.canSubmit || state.isSubmitting || isPending}
                                            className="w-full"
                                        >
                                            <Text>
                                                {isPending 
                                                    ? 'Entrando...' 
                                                    : state.isSubmitting 
                                                        ? 'Validando...' 
                                                        : 'Login'}
                                            </Text>
                                        </Button>
                                    )}
                                </form.Subscribe>
                            </CardFooter>
                        </Card>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
