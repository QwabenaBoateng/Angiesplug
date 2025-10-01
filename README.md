# Angie's Plug - E-Commerce Website

A modern, responsive e-commerce website built with React, Supabase, and Tailwind CSS. Features a public shopping site and a secure admin panel for managing products, orders, and categories.

## 🚀 Features

### Public Website
- **Homepage**: Hero section, featured products, new arrivals, promotional banners
- **Product Catalog**: Grid/list view with filtering, sorting, and search
- **Product Details**: Image gallery, size/color selection, related products
- **Shopping Cart**: Add/remove items, quantity management, price calculation
- **Checkout**: Shipping information, order summary, payment processing
- **User Authentication**: Login/signup with Supabase Auth
- **User Profile**: Order history, account management

### Admin Panel
- **Dashboard**: Sales metrics, recent orders, quick actions
- **Product Management**: CRUD operations, image upload, category assignment
- **Order Management**: View orders, update status, customer information
- **Category Management**: Create and organize product categories
- **Secure Access**: Role-based authentication for admin users

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, React Router DOM
- **Backend**: Supabase (Database, Auth, Storage)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

- Node.js 16+ and npm
- Supabase account
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd angiesplug-ecommerce
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database Schema

Run the following SQL in your Supabase SQL editor:

```sql
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category_id UUID REFERENCES categories(id),
  image_urls TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  shipping_address JSONB,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  size TEXT,
  color TEXT
);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Set up RLS policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Only admins can manage categories" ON categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Only admins can manage products" ON products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Order items are viewable by order owner" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Order items are viewable by admins" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Storage policies
CREATE POLICY "Product images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Only admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Only admins can delete product images" ON storage.objects FOR DELETE USING (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
```

### 5. Create Sample Data

Add some sample categories and products:

```sql
-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('T-Shirts', 't-shirts', 'Comfortable and stylish t-shirts'),
('Hoodies', 'hoodies', 'Warm and cozy hoodies'),
('Jeans', 'jeans', 'Classic denim jeans'),
('Dresses', 'dresses', 'Elegant and trendy dresses');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, featured) VALUES
('Classic White T-Shirt', 'A comfortable and versatile white t-shirt perfect for any occasion.', 19.99, (SELECT id FROM categories WHERE slug = 't-shirts'), true),
('Black Hoodie', 'A warm and stylish black hoodie with a comfortable fit.', 49.99, (SELECT id FROM categories WHERE slug = 'hoodies'), true),
('Blue Denim Jeans', 'Classic blue jeans with a modern fit and comfortable stretch.', 79.99, (SELECT id FROM categories WHERE slug = 'jeans'), false);
```

### 6. Create Admin User

1. Sign up for a regular account through the website
2. Go to your Supabase dashboard > Authentication > Users
3. Find your user and note the UUID
4. Run this SQL to make yourself an admin:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'your-user-uuid-here';
```

### 7. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your e-commerce site!

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard
4. Set up redirects for SPA routing in `public/_redirects`:

```
/*    /index.html   200
```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Footer
│   ├── admin/           # Admin-specific components
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx         # Homepage
│   ├── Shop.jsx         # Product listing
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Profile.jsx
│   └── admin/           # Admin pages
├── store/
│   └── useStore.js      # Zustand store
├── lib/
│   └── supabase.js      # Supabase client
└── App.jsx              # Main app component
```

## 🔧 Configuration

### Environment Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Supabase Setup

1. **Authentication**: Email/password authentication is enabled by default
2. **Database**: All tables with proper RLS policies
3. **Storage**: Products bucket for image uploads
4. **Admin Access**: Users with `role = 'admin'` can access admin panel

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update colors in `src/index.css`
- Customize components in `src/components/`

### Features
- Add payment integration (Stripe, PayPal)
- Implement email notifications
- Add product variants (sizes, colors)
- Set up analytics tracking

## 🐛 Troubleshooting

### Common Issues

1. **Supabase connection errors**: Check your environment variables
2. **Admin access denied**: Ensure user role is set to 'admin'
3. **Image upload fails**: Check storage bucket permissions
4. **Build errors**: Ensure all dependencies are installed

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [React documentation](https://react.dev)
- Check [Tailwind CSS docs](https://tailwindcss.com/docs)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email support@angiesplug.com or create an issue in the repository.