'use client';

import { useSocket } from '@/hooks/useSocket';
import { useEffect } from 'react';

export function RealTimeNotifications() {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('new_announcement', (data) => {
      // In a real app, use a toast notification here
      console.log('New announcement:', data);
    });

    socket.on('receive_message', (data) => {
      console.log('New message:', data);
    });

    return () => {
      socket.off('new_announcement');
      socket.off('receive_message');
    };
  }, [socket]);

  return null;
}
