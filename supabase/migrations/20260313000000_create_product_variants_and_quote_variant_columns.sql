-- Create product_variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_type TEXT NOT NULL,
  variant_value TEXT NOT NULL,
  variant_color_code TEXT,
  image TEXT,
  stock_quantity INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- make variants readable by everyone, but only admins can modify
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can select variants" ON public.product_variants
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all variants" ON public.product_variants
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- augment quote_requests with variant columns
ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS variant_type TEXT,
  ADD COLUMN IF NOT EXISTS variant_value TEXT;

-- index the new columns for faster filtering/search
CREATE INDEX IF NOT EXISTS idx_quote_requests_variant_type ON public.quote_requests(variant_type);
CREATE INDEX IF NOT EXISTS idx_quote_requests_variant_value ON public.quote_requests(variant_value);
