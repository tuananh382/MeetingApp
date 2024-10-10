import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 8000;

app.get('/', (req, res) => {
  res.send('Web Meeting App is running');
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId: string, userId: string) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
  });

  socket.on('sending-signal', (payload) => {
    io.to(payload.userToSignal).emit('receiving-signal', payload);
  });

  socket.on('returning-signal', (payload) => {
    io.to(payload.userId).emit('receiving-returned-signal', payload);
  });
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
