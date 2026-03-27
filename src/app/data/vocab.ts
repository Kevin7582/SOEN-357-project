export interface VocabWord {
  id: number;
  word: string;
  translation: string;
  language: string;
  image: string;
  category: string;
}

export const vocab: VocabWord[] = [
  {
    id: 1,
    word: "Apple",
    translation: "Manzana",
    language: "Spanish",
    image: "https://images.unsplash.com/photo-1669999207738-fcdb7103a6f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMGZydWl0JTIwcmVkfGVufDF8fHx8MTc3NDYxMDQ0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Food",
  },
  {
    id: 2,
    word: "Dog",
    translation: "Perro",
    language: "Spanish",
    image: "https://images.unsplash.com/photo-1702273220423-a162e298d214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBkb2clMjBzaXR0aW5nfGVufDF8fHx8MTc3NDU5NDIwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Animals",
  },
  {
    id: 3,
    word: "House",
    translation: "Casa",
    language: "Spanish",
    image: "https://images.unsplash.com/photo-1699210025833-07318c121bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwaG91c2UlMjBob21lJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzc0NjUyODY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Places",
  },
  {
    id: 4,
    word: "Book",
    translation: "Libro",
    language: "Spanish",
    image: "https://images.unsplash.com/photo-1637962638310-e6787f7eb324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVuJTIwYm9vayUyMHJlYWRpbmd8ZW58MXx8fHwxNzc0NTU3NDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Objects",
  },
  {
    id: 5,
    word: "Car",
    translation: "Coche",
    language: "Spanish",
    image: "https://images.unsplash.com/photo-1717348304122-a2a7bcd4fc04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB2ZWhpY2xlJTIwcm9hZHxlbnwxfHx8fDE3NzQ1ODkzODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Transport",
  },
  {
    id: 6,
    word: "Tree",
    translation: "Árbol",
    language: "Spanish",
    image: "https://images.unsplash.com/photo-1640865651855-68079e656075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRyZWUlMjBmb3Jlc3QlMjBuYXR1cmV8ZW58MXx8fHwxNzc0NjUyODY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Nature",
  },
  {
    id: 7,
    word: "Bird",
    translation: "Pájaro",
    language: "Spanish",
    image: "https://images.unsplash.com/photo-1688223466923-bb9b81f1ae0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJkJTIwZmx5aW5nJTIwc2t5fGVufDF8fHx8MTc3NDU4Mjg4NHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Animals",
  },
  {
    id: 8,
    word: "Mountain",
    translation: "Montaña",
    language: "Spanish",
    image: "https://images.unsplash.com/photo-1732239808105-d2320100247c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHBlYWslMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc0NjUyODY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Nature",
  },
  {
    id: 9,
    word: "Fish",
    translation: "Pez",
    language: "Spanish",
    image: "https://images.unsplash.com/photo-1671227375233-c4bf4533309f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMGZpc2glMjB1bmRlcndhdGVyfGVufDF8fHx8MTc3NDYzODc5NXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Animals",
  },
  {
    id: 10,
    word: "Sun",
    translation: "Sol",
    language: "Spanish",
    image: "https://images.unsplash.com/photo-1725785821131-f3c264e2b1f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW4lMjBzdW5yaXNlJTIwYnJpZ2h0JTIwc2t5fGVufDF8fHx8MTc3NDY1Mjg2OXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Nature",
  },
];
