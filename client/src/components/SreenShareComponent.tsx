import React, { useState } from 'react';

interface ScreenShareProps {
  stream?: MediaStream;
  onShareScreen: (stream: MediaStream) => void;
  onStopSharing: () => void;
}

const ScreenShareComponent: React.FC<ScreenShareProps> = ({ onShareScreen, onStopSharing }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShareScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
      onShareScreen(stream);
      setIsSharing(true);
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const handleStopSharing = () => {
    onStopSharing();
    setIsSharing(false);
  };

  // Corrected inline styles
  const styles = {
    container: {
      display: 'flex' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      flexDirection: 'column' as const,
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '300px',
      margin: '20px auto',
    },
    button: {
      padding: '10px 20px',
      margin: '10px 0',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
    },
    shareButton: {
      backgroundColor: '#007bff',
      color: '#fff',
    },
    stopButton: {
      backgroundColor: '#dc3545',
      color: '#fff',
    },
  };

  return (
    <div style={styles.container}>
      {isSharing ? (
        <button
          onClick={handleStopSharing}
          style={{ ...styles.button, ...styles.stopButton }}
          onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#a71d2a')}
          onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#dc3545')}
        >
          Stop Sharing
        </button>
      ) : (
        <button
          onClick={handleShareScreen}
          style={{ ...styles.button, ...styles.shareButton }}
          onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#007bff')}
        >
          Share Screen
        </button>
      )}
    </div>
  );
};

export default ScreenShareComponent;
