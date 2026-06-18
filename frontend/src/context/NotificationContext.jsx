import { createContext, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const show = (type, message) => {
    setNotification({ type, message });
    window.clearTimeout(window.__tiffinToastTimer);
    window.__tiffinToastTimer = window.setTimeout(() => setNotification(null), 3000);
  };

  const value = useMemo(
    () => ({
      notification,
      success: (message) => show('success', message),
      error: (message) => show('error', message),
      info: (message) => show('info', message),
      clear: () => setNotification(null),
    }),
    [notification]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
