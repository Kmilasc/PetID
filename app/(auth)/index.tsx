import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function Page() {
  return (
    <View className="flex-1 bg-gray-100 justify-center items-center px-6">
      <View className="mb-6">
        <FontAwesome name="paw" size={80} color="#6B7280" accessibilityLabel="Paw icon" />
      </View>
      <Text className="text-3xl font-bold text-gray-800 mb-2 text-center">
        PET ID
      </Text>
      <Text className="text-base text-gray-500 mb-8 text-center">
        IDENTIFICAÇÃO DIGITAL PARA PETS
      </Text>
      <View className='max-w-xs flex flex-col w-full gap-2'>
        <Link
          replace
          href="/login"
          asChild
        >
          <Button variant="default">
            <Text>ENTRAR</Text>
          </Button>
        </Link>
        <Link
          replace
          href="/signup"
          asChild
        >
          <Button variant="default">
            <Text>CRIAR CONTA</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
