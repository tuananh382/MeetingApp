import { Server, Socket } from 'socket.io';

interface Room {
  members: string[];
}

let rooms: { [roomId: string]: Room } = {};

export function handleMeeting(socket: Socket, io: Server) {
  socket.on('join-room', (roomId: string, userId: string) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = { members: [] };
    }
    rooms[roomId].members.push(userId);

    console.log(`User ${userId} joined room ${roomId}`);
    
    io.to(roomId).emit('members-update', rooms[roomId].members);
    socket.to(roomId).emit('user-connected', userId);
  });

  socket.on('leave-room', (roomId: string, userId: string) => {
    socket.leave(roomId);
    if (rooms[roomId]) {
      rooms[roomId].members = rooms[roomId].members.filter((id) => id !== userId);
      if (rooms[roomId].members.length === 0) {
        delete rooms[roomId];
      } else {
        io.to(roomId).emit('members-update', rooms[roomId].members);
      }
    }
    console.log(`User ${userId} left room ${roomId}`);
    socket.to(roomId).emit('user-disconnected', userId);
  });

  socket.on('share-screen', (roomId: string, userId: string, signalData: any) => {
    console.log(`User ${userId} is sharing screen in room ${roomId}`);
    socket.to(roomId).emit('screen-shared', { userId, signalData });
  });

  socket.on('stop-share-screen', (roomId: string, userId: string) => {
    console.log(`User ${userId} stopped sharing screen in room ${roomId}`);
    socket.to(roomId).emit('screen-share-stopped', userId);
  });

  socket.on('send-chat-message', (roomId: string, message: string, userId: string) => {
    console.log(`User ${userId} sent a message to room ${roomId}: ${message}`);
    io.to(roomId).emit('chat-message', { message, userId });
  });
}
