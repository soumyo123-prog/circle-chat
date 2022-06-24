import { createContext, PropsWithChildren, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_IO_URL } from '../../constants';

const socket = io(SOCKET_IO_URL);

const SocketContext = createContext<{ socket: Socket }>({
  socket: socket
});

export const SocketProvider = ({ children }: PropsWithChildren<{}>) => {
  return (
    <SocketContext.Provider value={{ socket: socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
