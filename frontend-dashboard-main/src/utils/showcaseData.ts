export type ShowcaseApi = {
  id: string;
  APIname: string;
  items: Record<string, unknown>[];
  originalApi: {
    apiUrl: string;
  };
  type: "created" | "updated";
  date: string;
};

export const showcaseProducts: Record<string, unknown>[] = [
  {
    id: "nxt-001",
    name: "Nordic Wool Throw",
    category: "Home textile",
    price: "899 SEK",
    stock: 24,
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&auto=format&fit=crop",
  },
  {
    id: "nxt-002",
    name: "Ceramic Table Lamp",
    category: "Lighting",
    price: "1 249 SEK",
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop",
  },
  {
    id: "nxt-003",
    name: "Oak Storage Box",
    category: "Storage",
    price: "549 SEK",
    stock: 31,
    image:
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&auto=format&fit=crop",
  },
];

export const defaultShowcaseApis: ShowcaseApi[] = [
  {
    id: "demo-api-products",
    APIname: "Demo Product Feed",
    items: showcaseProducts,
    originalApi: {
      apiUrl: "showcase://demo-products",
    },
    type: "created",
    date: new Date().toISOString(),
  },
];

export const demoUser = {
  id: "showcase-user",
  email: "demo@nextract.se",
  company: "Nextract Demo",
};
