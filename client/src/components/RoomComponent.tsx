import React, { CSSProperties } from 'react';

interface RoomProps {
  onJoin: (roomId: string) => void;
  onLeave: (roomId: string) => void;
  isConnected: boolean;
}

const RoomComponent: React.FC<RoomProps> = ({ onJoin, onLeave, isConnected }) => {
  const [roomId, setRoomId] = React.useState<string>('');

  // Inline CSS styles
  const styles: { [key: string]: CSSProperties } = {
    container: {
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#f0f0f0',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      width: '300px',
      margin: '0 auto',
    },
    input: {
      width: '80%',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      border: '1px solid #ccc',
      outline: 'none',
    },
    button: {
      padding: '10px 20px',
      margin: '5px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    joinButton: {
      backgroundColor: isConnected ? '#cccccc' : '#007bff',
      color: '#fff',
      cursor: isConnected ? 'not-allowed' : 'pointer',
    },
    leaveButton: {
      backgroundColor: !isConnected ? '#cccccc' : '#dc3545',
      color: '#fff',
      cursor: !isConnected ? 'not-allowed' : 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter Room ID"
        style={styles.input}
      />
      <button
        onClick={() => onJoin(roomId)}
        disabled={isConnected}
        style={{ ...styles.button, ...styles.joinButton }}
      >
        Join Room
      </button>
      <button
        onClick={() => onLeave(roomId)}
        disabled={!isConnected}
        style={{ ...styles.button, ...styles.leaveButton }}
      >
        Leave Room
      </button>
    </div>
  );
};

export default RoomComponent;
