import { supabase } from '@/integrations/supabase/client'

export const sendNotification = async (type: 'email' | 'whatsapp', event: 'registration' | 'order_placed' | 'order_status_update', recipient: string, subject: string | undefined, message: string, userId?: string, orderId?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: {
        type,
        event,
        recipient,
        subject,
        message,
        orderId,
        userId
      }
    })

    if (error) {
      console.error('Error sending notification:', error)
      return false
    }

    return data.success
  } catch (error) {
    console.error('Error invoking send-notification function:', error)
    return false
  }
}

export const generateAndSendNotifications = async (event: 'registration' | 'order_placed' | 'order_status_update', userId: string, orderId?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-notification', {
      body: {
        event,
        userId,
        orderId
      }
    })

    if (error) {
      console.error('Error generating notifications:', error)
      return false
    }

    const notifications = data.notifications

    // Send each notification
    for (const notification of notifications) {
      await sendNotification(
        notification.type,
        notification.event,
        notification.recipient,
        notification.subject,
        notification.message,
        notification.userId,
        notification.orderId
      )
    }

    return true
  } catch (error) {
    console.error('Error generating and sending notifications:', error)
    return false
  }
}