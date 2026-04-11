-- Run this file in your new Supabase Project's SQL Editor to create all the necessary tables.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'user',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT FALSE,
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  size TEXT,
  color TEXT,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotional Section
CREATE TABLE IF NOT EXISTS promotional_section (
  id SERIAL PRIMARY KEY,
  promo_image TEXT,
  promo_video TEXT,
  promo_video_poster TEXT,
  promo_title TEXT NOT NULL DEFAULT 'FIND YOUR PERFECT LOOK AT EXQUISITE BOUTIQUE',
  promo_description TEXT NOT NULL DEFAULT 'Discover exclusive streetwear that sets you apart from the crowd.',
  promo_discount_text TEXT NOT NULL DEFAULT 'SALES AND DISCOUNT!',
  promo_discount_percentage TEXT NOT NULL DEFAULT '87%',
  promo_button_text TEXT NOT NULL DEFAULT 'FIND THE STORE',
  promo_button_link TEXT NOT NULL DEFAULT '/shop',
  promo_video_button_text TEXT NOT NULL DEFAULT 'SHOP NOW →',
  promo_video_button_link TEXT NOT NULL DEFAULT '/shop',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Page
CREATE TABLE IF NOT EXISTS about_page (
  id SERIAL PRIMARY KEY,
  hero_image TEXT,
  angie_image TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  whats_the_plug TEXT,
  our_vibe TEXT,
  angie_quote TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial empty record for About Page if it doesn't exist
INSERT INTO about_page (id, hero_title) VALUES (1, 'About Us') ON CONFLICT DO NOTHING;

-- Create Storage Bucket "angies-db"
INSERT INTO storage.buckets (id, name, public) VALUES ('angies-db', 'angies-db', true) ON CONFLICT (id) DO NOTHING;

-- Optional: Allow public to view buckets. This is needed if making the bucket fully open
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'angies-db');
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'angies-db');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'angies-db');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'angies-db');

-- Disable RLS temporarily or setup permissive RLS for tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE promotional_section DISABLE ROW LEVEL SECURITY;
ALTER TABLE about_page DISABLE ROW LEVEL SECURITY;

-- Storage buckets
-- You will also need to manually ensure the 'angies-db' bucket exists in the Storage section 
-- and make sure it has public access enabled if the script above fails.
