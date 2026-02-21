import { io } from 'socket.io-client';

const SOCKET_URL = "http://localhost:5001" || import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
    withCredentials: true,
});

export default socket;