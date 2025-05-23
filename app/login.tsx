import { Link } from "expo-router";
import { View, KeyboardAvoidingView, Platform } from "react-native";
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

export default function Login() {
    return (
        <KeyboardAvoidingView
            className="flex-1 justify-center items-center m-8"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Entrar agora!</CardTitle>
                    <CardDescription>
                        Entre na sua conta e comece a mexer com seus bixinhos.
                    </CardDescription>
                </CardHeader>
                <CardContent className='gap-4 native:gap-2 flex flex-col'>
                    <View className='gap-1'>
                        <Label nativeID='email'>Email</Label>
                        <Input aria-aria-labelledby='email' keyboardType="email-address" textContentType="emailAddress" returnKeyType="next" />
                    </View>
                    <View className='gap-1'>
                        <Label nativeID='password'>Senha</Label>
                        <Input id='password' textContentType="password" secureTextEntry />
                    </View>
                    <Link href="/signup" asChild>
                        <Button variant="link">
                            <Text>Não tem uma conta? então crie uma.</Text>
                        </Button>
                    </Link>
                </CardContent>
                <CardFooter>
                    <Link href="/my-pets" asChild>
                        <Button>
                            <Text>Login</Text>
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </KeyboardAvoidingView>
    );
};
