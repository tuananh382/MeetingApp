import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import RoomComponent from './components/RoomComponent';
import VideoComponent from './components/VideoComponent';
import ChatComponent from './components/ChatComponent';
import ScreenShareComponent from './components/SreenShareComponent';
import MembersListComponent from './components/MembersListComponent';
import { useRoom } from './hooks/useRoom'

const socket = io('http://localhost:8000', {
  // withCredentials: true,
  transports: ['websocket', 'polling', 'flashsocket']
});

const App: React.FC = () => {
  const { isConnected, joinRoom, leaveRoom, partnerStream, userStream, screenStream, shareScreen, stopSharingScreen } = useRoom(socket);
  const [roomId, setRoomId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [members, setMembers] = useState<string[]>([]);

  useEffect(() => {
    const generatedUserId = `user_${Math.floor(Math.random() * 10000)}`;
    setUserId(generatedUserId);
  }, []);

  useEffect(() => {
    socket.on('members-update', (updatedMembers: string[]) => {
      setMembers(updatedMembers);
    });

    return () => {
      socket.off('members-update');
    };
  }, [socket]);

  const handleJoinRoom = (id: string) => {
    setRoomId(id);
    joinRoom(id);
  };

  const handleLeaveRoom = (id: string) => {
    setRoomId('');
    leaveRoom(id);
  };

  return (
    <div className="App">
      <h1>Web Meeting</h1>
      <RoomComponent
        onJoin={handleJoinRoom}
        onLeave={handleLeaveRoom}
        isConnected={isConnected}
      />
      <div className="videos" style={{ display: 'flex', flexDirection: 'row' }}>
        <VideoComponent stream={userStream} />
        <VideoComponent stream={partnerStream} />
        {screenStream && <VideoComponent stream={screenStream} />} 
      </div>
      <MembersListComponent members={members} />
      <ChatComponent roomId={roomId} userId={userId} socket={socket} />
      <ScreenShareComponent onShareScreen={() => shareScreen(roomId)} onStopSharing={stopSharingScreen} />
    </div>
  );
};

export default App;
