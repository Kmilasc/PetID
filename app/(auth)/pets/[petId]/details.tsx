import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from "@tanstack/react-query";
import { createURL } from 'expo-linking';
import { router, useLocalSearchParams } from "expo-router";
import { isAvailableAsync } from 'expo-sharing';
import { useRef, useState } from "react";
import { View } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import ViewShot from "react-native-view-shot";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "~/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Spinner } from "~/components/ui/spinner";
import { Text } from "~/components/ui/text";
import { useDeletePet } from "~/hooks/mutations/pets";
import { useSharePet } from "~/hooks/mutations/sharePet";
import { usePet } from '~/hooks/queries/pets';
import { useToastContext } from "~/components/ui/toast-provider";
import { useUser } from '~/hooks/queries/users';

export default function PetDetails() {
  const { petId } = useLocalSearchParams();
  const viewShotRef = useRef<ViewShot>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const url = createURL(`/pets/${petId}/scanned`);
  const { showToast } = useToastContext();

  const { data: isAvailableAsyncResult } = useQuery({
    queryKey: ['isAvailableAsync'],
    queryFn: () => isAvailableAsync(),
  });

  const { data: pet, isLoading: isPetLoading } = usePet(petId as string);
  const { data: user, isLoading: isUserLoading } = useUser(pet?.ownerId);
  const { mutate: share, isPending: isSharing } = useSharePet();
  const { mutate: deletePet, isPending: isDeleting } = useDeletePet(() => {
    router.back();
  });

  const isLoading = isPetLoading || isUserLoading;

  const handleDelete = () => {
    deletePet(petId as string, {
      onError: (error) => {
        showToast({
          title: "Erro ao deletar pet",
          description: error.message || "Ocorreu um erro ao tentar deletar o pet. Tente novamente.",
          variant: "destructive",
          iconName: "error",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <Spinner size="lg" className="mb-4" />
        <Text className="text-muted-foreground">Carregando detalhes do pet...</Text>
      </View>
    );
  }

  if (!pet) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Pet não encontrado</Text>
      </View>
    );
  }
  
  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center px-4 py-2">
        <Text className="text-xl font-bold" accessibilityRole="header">
          Detalhes do Pet
        </Text>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MaterialIcons name="more-vert" size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem onPress={() => router.push({
                pathname: "/pets/register",
                params: { petId: petId },
              })}>
                <MaterialIcons name="edit" size={20} className="mr-2" />
                <Text>Editar Pet</Text>
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={isDeleting}
                onPress={() => setIsDeleteDialogOpen(true)}
              >
                <MaterialIcons name="delete" size={20} className="mr-2" />
                <Text>{isDeleting ? 'Deletando...' : 'Deletar Pet'}</Text>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja deletar este pet?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá permanentemente deletar os dados do pet
              do nosso servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              <Text>Cancelar</Text>
            </AlertDialogCancel>
            <AlertDialogAction 
              disabled={isDeleting}
              onPress={handleDelete}
            >
              {isDeleting ? (
                <View className="flex-row items-center">
                  <Spinner size="sm" className="mr-2" />
                  <Text>Deletando...</Text>
                </View>
              ) : (
                <Text>Confirmar</Text>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <View className="max-w-sm self-center">
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.9 }}>
          <Card className="p-4 bg-white rounded-xl shadow-md">
            <View className="flex items-center justify-center mb-4">
              <Avatar className="w-32 h-32" alt={`Foto de ${pet.name}`}>
                {pet.photo ? (
                  <AvatarImage source={{ uri: pet.photo }} />
                ) : (
                  <AvatarFallback>
                    <Text className="text-2xl">🐾</Text>
                  </AvatarFallback>
                )}
              </Avatar>
            </View>
            <Text className="font-bold text-center text-lg mb-2">{pet.name}</Text>
            <Text>Raça: {pet.breed}</Text>
            <Text>Sexo: {pet.sex}</Text>
            <Text>Vacinas em dia? {pet.vaccinated ? 'Sim' : 'Não'}</Text>
            <Text>Doenças ou alergias: {pet.diseases || 'Nenhuma'}</Text>
            <Text className="mt-3 font-bold">Contato do Tutor</Text>
            <Text>{user?.name || 'Não informado'}</Text>
            <Text>{user?.contact || 'Não informado'}</Text>
            <View className="flex items-center justify-center my-4">
              <QRCode value={url} size={140} />
            </View>
          </Card>
        </ViewShot>
        <View className="mx-3 mt-3 mb-6">
          {isAvailableAsyncResult && (
            <Button 
              className="w-full mb-3" 
              accessibilityLabel="Compartilhar ou imprimir QR Code" 
              onPress={() => share({ viewShotRef: viewShotRef.current, pet: pet })}
              disabled={isSharing}
            >
              {isSharing ? (
                <View className="flex-row items-center justify-center">
                  <Spinner size="sm" className="mr-2" />
                  <Text>Compartilhando...</Text>
                </View>
              ) : (
                <Text>Compartilhar/Imprimir QR Code</Text>
              )}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}