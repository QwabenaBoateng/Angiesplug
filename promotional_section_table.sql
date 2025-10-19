-- Create promotional_section table
CREATE TABLE IF NOT EXISTS promotional_section (
  id SERIAL PRIMARY KEY,
  promo_image TEXT,
  promo_video TEXT,
  promo_video_poster TEXT,
  promo_title TEXT NOT NULL DEFAULT 'FIND YOUR PERFECT LOOK AT ANGIE''S PLUG',
  promo_description TEXT NOT NULL DEFAULT 'Discover exclusive streetwear that sets you apart from the crowd. From fresh drops to limited editions, we curate the hottest pieces that define your unique style. No basic fits, just pure drip.',
  promo_discount_text TEXT NOT NULL DEFAULT 'SALES AND DISCOUNT!',
  promo_discount_percentage TEXT NOT NULL DEFAULT '87%',
  promo_button_text TEXT NOT NULL DEFAULT 'FIND THE STORE',
  promo_button_link TEXT NOT NULL DEFAULT '/shop',
  promo_video_button_text TEXT NOT NULL DEFAULT 'SHOP NOW →',
  promo_video_button_link TEXT NOT NULL DEFAULT '/shop',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default promotional content
INSERT INTO promotional_section (
  promo_image,
  promo_video,
  promo_video_poster,
  promo_title,
  promo_description,
  promo_discount_text,
  promo_discount_percentage,
  promo_button_text,
  promo_button_link,
  promo_video_button_text,
  promo_video_button_link
) VALUES (
  '/api/placeholder/400/300',
  NULL,
  NULL,
  'FIND YOUR PERFECT LOOK AT ANGIE''S PLUG',
  'Discover exclusive streetwear that sets you apart from the crowd. From fresh drops to limited editions, we curate the hottest pieces that define your unique style. No basic fits, just pure drip.',
  'SALES AND DISCOUNT!',
  '87%',
  'FIND THE STORE',
  '/shop',
  'SHOP NOW →',
  '/shop'
) ON CONFLICT DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_promotional_section_updated_at 
    BEFORE UPDATE ON promotional_section 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
