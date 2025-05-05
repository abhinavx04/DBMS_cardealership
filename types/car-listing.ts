export interface CarListing {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  category?: string;
  color?: string;
  description: string;
  images: string[];
  features?: string[];
  location?: string;
  created_at: string;
  updated_at: string;
}

export type NewCarListing = Omit<
  CarListing, 
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;

export interface SavedListing {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}