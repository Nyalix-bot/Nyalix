import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useQuoteNotifications = () => {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('quote_requests')
        .select('id', { count: 'exact', head: 0 })
        .eq('status', 'Pending');
      
      setCount(data?.length || 0);
    } catch (err) {
      console.error('Failed to fetch quote count:', err);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    // Refresh every 10 seconds
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  return { count };
};

export default useQuoteNotifications;
