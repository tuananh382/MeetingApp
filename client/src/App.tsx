import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import RoomComponent from './components/RoomComponent';
import VideoComponent from './components/VideoComponent';
import ChatComponent from './components/ChatComponent';
import ScreenShareComponent from './components/SreenShareComponent';
import MembersListComponent from './components/MembersListComponent';
import { useRoom } from './hook/useRoom';

const socket = io('http://localhost:8000', {
  withCredentials: true,
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

  const joinRoom = () => {
    if (roomId.trim()) {
      socket.emit('join-room', roomId, userId);
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        socket.on('user-connected', (userId) => {
          peerRef.current = new Peer({
            initiator: true,
            trickle: false,
            stream,
          });

          peerRef.current.on('signal', (data) => {
            socket.emit('sending-signal', { userToSignal: userId, signal: data });
          });
        
          peerRef.current.on('stream', (partnerStream) => {
            if (partnerVideo.current) {
              partnerVideo.current.srcObject = partnerStream;
            }
          });
        });

        socket.on('receiving-signal', (payload) => {
          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
          });

          peer.on('signal', (signal) => {
            socket.emit('returning-signal', { signal, userId });
          });

          peer.on('stream', (partnerStream) => {
            if (partnerVideo.current) {
              partnerVideo.current.srcObject = partnerStream;
            }
          });

          peer.signal(payload.signal);
        });
      });
      setIsConnected(true);
    }
  };

  return (
    <div className="App">
      <h1>Web Meeting App</h1>
      <input 
        type="text" 
        placeholder="Enter Room ID" 
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)} 
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
