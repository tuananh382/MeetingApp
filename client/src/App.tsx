import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import RoomComponent from './components/RoomComponent';
import VideoComponent from './components/VideoComponent';
import ChatComponent from './components/ChatComponent';
import ScreenShareComponent from './components/SreenShareComponent';
import MembersListComponent from './components/MembersListComponent';
import { useRoom } from './hooks/useRoom';

const socket = io('http://localhost:8000', {
  transports: ['websocket', 'polling', 'flashsocket'],
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

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: `'Arial', sans-serif`,
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '20px',
    },
    videoSection: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '20px',
    },
    chatSection: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'space-between',
      width: '100%',
      marginTop: '20px',
    },
    chat: {
      flex: 2,
      marginRight: '20px',
    },
    members: {
      flex: 1,
      marginLeft: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Web Meeting</h1>
      <RoomComponent
        onJoin={handleJoinRoom}
        onLeave={handleLeaveRoom}
        isConnected={isConnected}
      />
      <div style={styles.videoSection}>
        <VideoComponent stream={userStream} />
        {/* <VideoComponent stream={partnerStream} /> */}
        {screenStream && <VideoComponent stream={screenStream} />}
      </div>
      <div style={styles.chatSection}>
        <div style={styles.chat}>
          <ChatComponent roomId={roomId} userId={userId} socket={socket} />
        </div>
        <div style={styles.members}>
          <MembersListComponent members={members} />
        </div>
      </div>
      {/* <ScreenShareComponent onShareScreen={() => shareScreen(roomId)} onStopSharing={stopSharingScreen} /> */}
    </div>
  );
};

export default App;
