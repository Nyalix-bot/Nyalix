-- Add product_views table for tracking page views

CREATE TABLE public.product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

-- allow anyone to insert a view record (we don't store sensitive info)
CREATE POLICY "Anyone can insert product views" ON public.product_views
  FOR INSERT WITH CHECK (true);

-- admins can read view data
CREATE POLICY "Admins can view product views" ON public.product_views
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
