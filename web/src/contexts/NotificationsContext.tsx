import React, { createContext, useContext, useMemo, useState } from 'react';

export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  time: string; // e.g., '10:45'
  unread?: boolean;
};

interface NotificationsContextType {
  items: NotificationItem[];
  unreadCount: number;
  markAllAsRead: () => void;
  addNotification: (n: Omit<NotificationItem, 'id' | 'time' | 'unread'> & Partial<Pick<NotificationItem, 'time' | 'unread'>>) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<NotificationItem[]>([
    { id: '1', title: 'Novo match! 🎉', description: 'Você e Ana têm interesse mútuo.', time: '09:12', unread: true },
    { id: '2', title: 'Mensagem recebida', description: 'Carlos: "Oi, tudo bem?"', time: '08:55', unread: true },
    { id: '3', title: 'Item aprovado', description: 'Seu item "Tênis Branco" foi publicado.', time: 'Ontem', unread: false },
  ]);

  const unreadCount = useMemo(() => items.reduce((acc, n) => acc + (n.unread ? 1 : 0), 0), [items]);

  const markAllAsRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const addNotification: NotificationsContextType['addNotification'] = (n) => {
    const now = new Date();
    const time = n.time ?? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setItems((prev) => [{ id: Math.random().toString(36).slice(2), title: n.title, description: n.description, time, unread: n.unread ?? true }, ...prev]);
  };

  return (
    <NotificationsContext.Provider value={{ items, unreadCount, markAllAsRead, addNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};
