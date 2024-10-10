import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidV4 } from 'uuid';
import Peer from 'simple-peer';

const socket = io('http://localhost:5000');

function App() {
  const [roomId, setRoomId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<any>();

  useEffect(() => {
    const id = uuidV4();
    setUserId(id);
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
      <button onClick={joinRoom}>Join Room</button>

      {isConnected && (
        <div>
          <video ref={userVideo} autoPlay playsInline />
          <video ref={partnerVideo} autoPlay playsInline />
        </div>
      )}
    </div>
  );
}

export default App;
