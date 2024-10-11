import React from 'react';

interface RoomProps {
  onJoin: (roomId: string) => void;
  onLeave: (roomId: string) => void;
  isConnected: boolean;
}

const RoomComponent: React.FC<RoomProps> = ({ onJoin, onLeave, isConnected }) => {
  const [roomId, setRoomId] = React.useState<string>('');

  return (
    <div className="room">
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter Room ID"
      />
      <button onClick={() => onJoin(roomId)} disabled={isConnected}>
        Join Room
      </button>
      <button onClick={() => onLeave(roomId)} disabled={!isConnected}>
        Leave Room
      </button>
    </div>
  );
};

export default RoomComponent;
