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
    image: "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F34E.svg",
    category: "Food",
  },
  {
    id: 2,
    word: "Dog",
    translation: "Perro",
    language: "Spanish",
    image: "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F436.svg",
    category: "Animals",
  },
  {
    id: 3,
    word: "House",
    translation: "Casa",
    language: "Spanish",
    image: "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F3E0.svg",
    category: "Places",
  },
  {
    id: 4,
    word: "Book",
    translation: "Libro",
    language: "Spanish",
    image: "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F4D6.svg",
    category: "Objects",
  },
  {
    id: 5,
    word: "Car",
    translation: "Coche",
    language: "Spanish",
    image: "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F697.svg",
    category: "Transport",
  },
  {
    id: 6,
    word: "Tree",
    translation: "Árbol",
    language: "Spanish",
    image: "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F333.svg",
    category: "Nature",
  },
  {
    id: 7,
    word: "Bird",
    translation: "Pájaro",
    language: "Spanish",
    image: "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F426.svg",
    category: "Animals",
  },
  {
    id: 8,
    word: "Mountain",
    translation: "Montaña",
    language: "Spanish",
    image: "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/26F0.svg",
    category: "Nature",
  },
  {
    id: 9,
    word: "Fish",
    translation: "Pez",
    language: "Spanish",
    image: "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F41F.svg",
    category: "Animals",
  },
  {
    id: 10,
    word: "Sun",
    translation: "Sol",
    language: "Spanish",
    image: "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/2600.svg",
    category: "Nature",
  },
];
