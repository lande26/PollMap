import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { UserAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { session } = UserAuth();
    const socketRef = useRef(null);

    useEffect(() => {
        console.log('useEffect triggered. Session:', session ? 'exists' : 'none');

        // Clean up previous socket if exists
        if (socketRef.current) {
            console.log('Cleaning up previous socket connection');
            socketRef.current.close();
            socketRef.current = null;
        }

        const token = session?.access_token;
        console.log('Auth token:', token ? 'present' : 'missing (anonymous connection)');

        const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5001", {
            auth: {
                token: token || null,
            },
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log('Connected to server with ID:', newSocket.id);
        });

        newSocket.on("connect_error", (err) => {
            console.error('Connection error:', err.message);
        });

        newSocket.on("disconnect", (reason) => {
            console.log('Disconnected. Reason:', reason);
        });

        return () => {
            console.log('Cleanup — closing socket');
            newSocket.close();
            socketRef.current = null;
        };
    }, [session]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};