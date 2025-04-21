import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import singerRoutes from './routes/singers.js';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});


app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;  // attach io to requests
  next();
});

app.use('/api/singers', singerRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));