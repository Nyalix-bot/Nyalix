-- Add 'read' column to orders table for admin notification tracking
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS read BOOLEAN NOT NULL DEFAULT false;

-- Add 'read' column to newsletter_subscribers table for admin notification tracking
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN IF NOT EXISTS read BOOLEAN NOT NULL DEFAULT false;

-- Add 'read' column to profiles table for tracking new user registrations
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS admin_notified BOOLEAN NOT NULL DEFAULT false;

-- Create index for faster queries on unread items
CREATE INDEX IF NOT EXISTS idx_orders_read ON public.orders(read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_read ON public.newsletter_subscribers(read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_profiles_admin_notified ON public.profiles(admin_notified) WHERE admin_notified = false;
