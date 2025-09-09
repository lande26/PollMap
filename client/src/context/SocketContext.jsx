import React, {createContext, useContext, useEffect, useState} from 'react';
import { use } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const socket = io("http://localhost:5001");
        setSocket(socket);

        socket.on("connect", () => {
            console.log("Connected to socket server with ID:", socket.id);
        });
        socket.on("disconnect", () => {
            console.log("Disconnected from socket server");
        });
        return () => socket.close();
    }, []);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};