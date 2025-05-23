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

export default function Signup() {
    return (
        <KeyboardAvoidingView
            className="flex-1 justify-center items-center m-8"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Criar conta agora!</CardTitle>
                    <CardDescription>
                        Já tem uma conta? então faça o login.
                    </CardDescription>
                </CardHeader>
                <CardContent className='gap-4 native:gap-2'>
                    <View className='gap-1'>
                        <Label nativeID='email'>Email</Label>
                        <Input aria-aria-labelledby='email' />
                    </View>
                    <View className='gap-1'>
                        <Label nativeID='password'>Senha</Label>
                        <Input id='password' />
                    </View>
                </CardContent>
                <CardFooter>
                    <Link href="/my-pets" asChild>
                        <Button>
                            <Text>Criar conta</Text>
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </KeyboardAvoidingView>
    );
};
