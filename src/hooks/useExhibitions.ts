import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ExhibitionMedia {
  id: string;
  exhibition_id: string;
  type: 'image' | 'video';
  url: string;
  created_at: string;
}

export interface Exhibition {
  id: string;
  title: string;
  description: string;
  date: string | null;
  location: string;
  cover_image_url: string;
  created_at: string;
  updated_at: string;
  exhibition_media?: ExhibitionMedia[];
}

export const useExhibitions = () => {
  return useQuery({
    queryKey: ['exhibitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exhibitions')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Exhibition[];
    },
  });
};

export const useExhibition = (id: string) => {
  return useQuery({
    queryKey: ['exhibition', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exhibitions')
        .select('*, exhibition_media(*)')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as Exhibition | null;
    },
    enabled: !!id,
  });
};
