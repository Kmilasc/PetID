export interface Pet {
    id: string;
    name: string;
    icon: string;
    breed: string;
    sex: 'male' | 'female';
    isVaccinated: boolean;
    diseases?: string;
    contact: string;
    photo?: string;
}

export const pets: Pet[] = [
    {
        id: "aksdmalksd12",
        name: 'Rex',
        icon: '🐶',
        breed: 'Golden Retriever',
        sex: 'male',
        isVaccinated: true,
        diseases: 'Alérgico a alguns tipos de ração',
        contact: 'tutor.rex@email.com',
        photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d'
    },
    {
        id: "akldsl223l,m",
        name: 'Mimi',
        icon: '🐱',
        breed: 'Siamês',
        sex: 'female',
        isVaccinated: true,
        diseases: undefined,
        contact: '(11) 98765-4321',
        photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba'
    },
];