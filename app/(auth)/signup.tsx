import { MaterialIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Link } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { z } from 'zod';
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
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
import { Text } from "~/components/ui/text";
import { auth } from "~/services/firebase";

const firebaseErrorSchema = z.object({
    code: z.enum([
        'auth/email-already-in-use',
        'auth/invalid-email',
        'auth/operation-not-allowed',
        'auth/weak-password',
        'auth/network-request-failed'
    ]),
    message: z.string()
});

type FirebaseError = z.infer<typeof firebaseErrorSchema>;

const signupSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const getErrorMessage = (error: FirebaseError): string => {
    const errorMessages: Record<FirebaseError['code'], string> = {
        'auth/email-already-in-use': 'Este email já está em uso',
        'auth/invalid-email': 'Email inválido',
        'auth/operation-not-allowed': 'Operação não permitida',
        'auth/weak-password': 'Senha muito fraca',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet'
    };

    return errorMessages[error.code] || 'Erro ao criar conta';
};

export default function Signup() {
    const { mutate: signup, isPending, error: signupError } = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            try {
                const { user } = await createUserWithEmailAndPassword(auth, email, password);
                return user;
            } catch (error) {
                const parsedError = firebaseErrorSchema.safeParse(error);
                
                if (parsedError.success) {
                    throw new Error(getErrorMessage(parsedError.data));
                }
                
                throw new Error('Erro inesperado ao criar conta');
            }
        },
    });

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validators: {
            onChange: signupSchema,
        },
        onSubmit: async ({ value }) => {
            signup(value);
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
                                <CardTitle>Criar conta agora!</CardTitle>
                                <CardDescription>
                                    Já tem uma conta? então faça o login.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='gap-4 native:gap-2 flex flex-col'>
                                {signupError && (
                                    <Alert variant="destructive" icon={MaterialIcons} iconName="error">
                                        <AlertDescription>{signupError.message}</AlertDescription>
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
                                                    textContentType="newPassword"
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
                                <Link href="/login" asChild>
                                    <Button variant="link">
                                        <Text>Já tem uma conta? Faça login</Text>
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
                                                    ? 'Criando conta...' 
                                                    : state.isSubmitting 
                                                        ? 'Validando...' 
                                                        : 'Criar conta'}
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
