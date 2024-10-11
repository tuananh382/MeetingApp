import React, { useEffect, useRef } from 'react';

interface VideoProps {
  stream: MediaStream | null;
}

const VideoComponent: React.FC<VideoProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream; 
    }
  }, [stream]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '50%', height: '50%' }}
      />
    </div>
  );
};

export default VideoComponent;
