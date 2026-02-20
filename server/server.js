import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { supabase } from './supabaseClient.js';
import { handlePollSocket, cacheService } from './socket/poll.socket.js';
import { handleRoomSocket } from './socket/room.socket.js';
import { authorizeUser } from './middlewares/socketAuth.js';
dotenv.config();

const app = express();
const server = createServer(app);


const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    // credentials : true,
  }
});

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  console.log('Redis adapter connected');

  cacheService.setClient(pubClient);
});

// Wire up socket authentication middleware
io.use(authorizeUser);
console.log('Socket authentication middleware registered');

handlePollSocket(io);
handleRoomSocket(io, pubClient);


app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to PollMap Server!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.delete('/cache/polls/:pollId', async (req, res) => {
  try {
    await cacheService.invalidatePollCache(req.params.pollId);
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});