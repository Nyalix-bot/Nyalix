-- Function to send notifications
CREATE OR REPLACE FUNCTION send_notification(event_type text, user_id uuid, order_id uuid DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  notification_record record;
BEGIN
  -- Generate notifications
  SELECT * INTO notification_record FROM http((
    'POST',
    'https://ztbqtsenmscltylrrmky.supabase.co/functions/v1/generate-notification',
    ARRAY[http_header('Authorization', 'Bearer ' || (SELECT value FROM vault.secrets WHERE name = 'service_role_key'))],
    'application/json',
    json_build_object('event', event_type, 'userId', user_id, 'orderId', order_id)::text
  ));

  -- Send each notification
  FOR notification_record IN
    SELECT * FROM json_array_elements((notification_record.content::json)->'notifications')
  LOOP
    PERFORM http((
      'POST',
      'https://ztbqtsenmscltylrrmky.supabase.co/functions/v1/send-notification',
      ARRAY[http_header('Authorization', 'Bearer ' || (SELECT value FROM vault.secrets WHERE name = 'service_role_key'))],
      'application/json',
      notification_record::text
    ));
  END LOOP;
END;
$$;

-- Modify handle_new_user to send welcome notification
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);

  -- Send welcome notification
  PERFORM send_notification('registration', NEW.id);

  RETURN NEW;
END;
$$;

-- Trigger for order placed
CREATE OR REPLACE FUNCTION notify_order_placed()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Send order placed notifications
  PERFORM send_notification('order_placed', NEW.user_id, NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_order_placed
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION notify_order_placed();

-- Trigger for order status update
CREATE OR REPLACE FUNCTION notify_order_status_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only send notification if status actually changed
  IF OLD.status != NEW.status THEN
    PERFORM send_notification('order_status_update', NEW.user_id, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_order_status_update
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION notify_order_status_update();