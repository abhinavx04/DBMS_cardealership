/*
  # Create initial database schema for car dealership app

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, linked to auth.users)
      - `email` (text, not null)
      - `full_name` (text, optional)
      - `avatar_url` (text, optional)
      - `phone` (text, optional)
      - `location` (text, optional)
      - `created_at` (timestamptz)
    
    - `car_listings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `brand` (text)
      - `model` (text)
      - `year` (integer)
      - `price` (integer)
      - `mileage` (integer, optional)
      - `fuel_type` (text, optional)
      - `transmission` (text, optional)
      - `category` (text, optional)
      - `color` (text, optional)
      - `description` (text)
      - `images` (array of text)
      - `features` (array of text, optional)
      - `location` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `saved_listings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `listing_id` (uuid, references car_listings.id)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Create policies for users to manage their own data
    - Set up public read access for listings
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create car_listings table
CREATE TABLE IF NOT EXISTS car_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price INTEGER NOT NULL,
  mileage INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  category TEXT,
  color TEXT,
  description TEXT NOT NULL,
  images TEXT[] NOT NULL,
  features TEXT[],
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create saved_listings (wishlist) table
CREATE TABLE IF NOT EXISTS saved_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES car_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

-- Profiles security policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Car listings security policies
CREATE POLICY "Anyone can view car listings"
  ON car_listings
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Users can create their own car listings"
  ON car_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own car listings"
  ON car_listings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own car listings"
  ON car_listings
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Saved listings security policies
CREATE POLICY "Users can view their saved listings"
  ON saved_listings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can save listings"
  ON saved_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their saved listings"
  ON saved_listings
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the timestamp
CREATE TRIGGER update_car_listings_updated_at
  BEFORE UPDATE ON car_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create a function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (new.id, new.email, NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create profiles for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();