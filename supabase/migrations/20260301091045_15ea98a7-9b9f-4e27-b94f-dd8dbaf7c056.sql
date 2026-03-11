
-- Allow admins to delete orders
CREATE POLICY "Admins can delete orders" ON public.orders
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete contact messages
CREATE POLICY "Admins can delete contact messages" ON public.contact_messages
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
