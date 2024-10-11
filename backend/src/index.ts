import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { handleMeeting } from './meetingHandlers';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});
app.use(cors({
  origin: '*', 
}));

const PORT = process.env.PORT || 8000;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  handleMeeting(socket, io);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// app.get('/', (req, res) => {
//   res.send('Web Meeting Server is running');
// });

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
