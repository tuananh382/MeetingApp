import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';

export const useRoom = (socket: Socket) => {
  const [isConnected, setIsConnected] = useState(false);
  const [partnerStream, setPartnerStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const userStreamRef = useRef<MediaStream | null>(null);

  const joinRoom = async (roomId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      userStreamRef.current = stream;
      socket.emit('join-room', roomId, socket.id);
      setIsConnected(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const leaveRoom = (roomId: string) => {
    socket.emit('leave-room', roomId, socket.id);
    setIsConnected(false);

    if (peerRef.current) peerRef.current.destroy();
    if (userStreamRef.current) userStreamRef.current.getTracks().forEach(track => track.stop());
    setPartnerStream(null);
    setScreenStream(null);
  };

  const shareScreen = async (roomId: string) => {
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(screen);
      
   
      socket.emit('share-screen', roomId, socket.id);

      if (peerRef.current && screen) {
        screen.getTracks().forEach(track => {
          peerRef.current?.addTrack(track, screen); 
        });
      }
      
      screen.getTracks().forEach(track => {
        track.onended = () => {
          stopSharingScreen();
        };
      });
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const stopSharingScreen = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      socket.emit('stop-share-screen', socket.id);
    }
  };

  const initializePeer = (userId: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream: userStreamRef.current! });
    peer.on('signal', (signal) => {
      socket.emit('sending-signal', { userToSignal: userId, signal });
    });
    peer.on('stream', (stream) => {
      setPartnerStream(stream);
    });
    peerRef.current = peer;
  };

  useEffect(() => {
    socket.on('user-connected', (userId) => {
      initializePeer(userId);
    });

    socket.on('user-disconnected', () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      setPartnerStream(null);
    });


    socket.on('screen-shared', ({ userId, signalData }) => {
      if (peerRef.current) {
        peerRef.current.signal(signalData);
      }
    });

    return () => {
      socket.off('user-connected');
      socket.off('user-disconnected');
      socket.off('screen-shared'); 
    };
  }, [socket]);

  return {
    isConnected,
    joinRoom,
    leaveRoom,
    shareScreen,
    stopSharingScreen,
    partnerStream,
    userStream: userStreamRef.current,
    screenStream,
  };
};
