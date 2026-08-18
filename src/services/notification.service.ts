function getNotificationApi() {
  return window.electronAPI?.notificacao
}

export const notificationService = {
  async show(title: string, body: string): Promise<void> {
    try {
      const api = getNotificationApi()
      if (api) {
        await api.show(title, body)
      } else {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, { body })
        }
      }
    } catch {
      // Fallback silencioso
    }
  },
}
