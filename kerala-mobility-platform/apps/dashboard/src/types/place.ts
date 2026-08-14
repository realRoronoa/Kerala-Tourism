export interface Place {
  id: string;
  name: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  address: string;
  opening_hours: string;
  entry_fee: string;
  rating: number;
  images: string[];
  best_for: string[];
  tags: string[];
}

export type GroupType =
  | "alone"
  | "family"
  | "couple"
  | "friends"
  | "senior"
  | "adventure";
