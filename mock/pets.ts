import { Pet } from "~/hooks/queries/pets";

export const pets: Pet[] = [
    {
        id: "aksdmalksd12",
        name: 'Rex',
        breed: 'Golden Retriever',
        sex: 'male',
        diseases: 'Alérgico a alguns tipos de ração',
        photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d',
        vaccinated: true,
        ownerId: 'aksdmalksd12',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "akldsl223l,m",
        name: 'Mimi',
        breed: 'Siamês',
        sex: 'female',
        diseases: undefined,
        photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
        vaccinated: true,
        ownerId: 'aksdmalksd12',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];