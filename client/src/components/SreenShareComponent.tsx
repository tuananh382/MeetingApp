import React, { useState, useEffect, useRef } from 'react';

interface ScreenShareProps {
  stream?: MediaStream;
  onShareScreen: (stream: MediaStream) => void;
  onStopSharing: () => void;
}

const ScreenShareComponent: React.FC<ScreenShareProps> = ({ onShareScreen, onStopSharing }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShareScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
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

  return (
    <div>
      {isSharing ? (
        <button onClick={handleStopSharing}>Stop Sharing</button>
      ) : (
        <button onClick={handleShareScreen}>Share Screen</button>
      )}
    </div>
  );
};

export default ScreenShareComponent;
