export interface CardData {
  id: string;
  animalName: string;
  genericDescription: string;
  genericTraits: string[];
  personalizedDescription: string;
  representative: string;
  imageUrl: string;
}

// This is the raw type we expect from the Gemini API before client-side processing.
// The imageUrl is now added locally, so it's not part of this raw type.
export type RawCardData = Omit<CardData, 'id' | 'imageUrl'>;