export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      car_listings: {
        Row: {
          id: string
          user_id: string
          brand: string
          model: string
          year: number
          price: number
          mileage: number | null
          fuel_type: string | null
          transmission: string | null
          category: string | null
          color: string | null
          description: string
          images: string[]
          features: string[] | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brand: string
          model: string
          year: number
          price: number
          mileage?: number | null
          fuel_type?: string | null
          transmission?: string | null
          category?: string | null
          color?: string | null
          description: string
          images: string[]
          features?: string[] | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          brand?: string
          model?: string
          year?: number
          price?: number
          mileage?: number | null
          fuel_type?: string | null
          transmission?: string | null
          category?: string | null
          color?: string | null
          description?: string
          images?: string[]
          features?: string[] | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_listings: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          location?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}