'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');

    socketIo.on('connect', () => {
      socketIo.emit('join', user.id);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [user]);

  return socket;
}
