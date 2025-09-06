import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import {createClient} from 'redis';
import {createAdapter} from '@socket.io/redis-adapter';
import { supabase } from './supabaseClient.js';
import { handlePollSocket } from './socket/poll.socket.js';
dotenv.config();

const app = express();
const server = createServer(app);


const pubClient = createClient({url: process.env.REDIS_URL || 'redis://localhost:6379'});
const subClient = pubClient.duplicate();

const io = new Server(server, {
  cors:{
    origin : "http://localhost:5173",
    // credentials : true,
  }
});

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  console.log('Redis adapter connected');
});

handlePollSocket(io);

app.use(cors({origin: 'http://localhost:5173'}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to PollMap Server!');
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});