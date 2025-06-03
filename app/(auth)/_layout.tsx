import { useRouter, useNavigation, Slot, useSegments } from "expo-router";
import { useAuth } from "~/hooks/auth";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Spinner } from "~/components/ui/spinner";
import { Text } from "~/components/ui/text";

export default function AuthLayout() {
    const { isLoading, user } = useAuth();
    const router = useRouter();
    const navigation = useNavigation();

    const [canGoBack, setCanGoBack] = useState(router.canGoBack());
    const segments = useSegments();
    const isScanned = segments.includes('scanned');
    const addGoBackButtonForScanned = !user && isScanned;

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', () => {
            setCanGoBack(router.canGoBack());
        });

        return () => {
            unsubscribe();
        };
    }, [navigation, router]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner size="lg" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {(canGoBack || addGoBackButtonForScanned) && (
                <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e5e5e5'
                }}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#000"
                        onPress={() => addGoBackButtonForScanned ? router.replace('/') : router.back()}
                        style={{ marginRight: 8 }}
                    />
                    <Text>Voltar</Text>
                </View>
            )}
            <Slot />
        </View>
    );
}