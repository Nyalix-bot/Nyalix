
CREATE TABLE public.exhibitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date DATE,
  location TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.exhibition_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exhibition_id UUID NOT NULL REFERENCES public.exhibitions(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'image',
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exhibition_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exhibitions viewable by everyone" ON public.exhibitions FOR SELECT USING (true);
CREATE POLICY "Admins can manage exhibitions" ON public.exhibitions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Exhibition media viewable by everyone" ON public.exhibition_media FOR SELECT USING (true);
CREATE POLICY "Admins can manage exhibition media" ON public.exhibition_media FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_exhibitions_updated_at
  BEFORE UPDATE ON public.exhibitions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public)
VALUES ('exhibitions', 'exhibitions', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Exhibition media publicly readable" ON storage.objects FOR SELECT USING (bucket_id = 'exhibitions');
CREATE POLICY "Admins can upload exhibition media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'exhibitions' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete exhibition media" ON storage.objects FOR DELETE USING (bucket_id = 'exhibitions' AND has_role(auth.uid(), 'admin'::app_role));
