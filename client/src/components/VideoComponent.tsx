import React, { useEffect, useRef, CSSProperties } from 'react';

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

  // CSS Styles defined within the component
  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    border: '2px solid #ddd',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '15px',
    maxWidth: '900px',
    margin: '20px auto',
    overflow: 'hidden',
    height:'30%'
  };

  const videoStyle: CSSProperties = {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '8px',
  };

  return (
    <div style={containerStyle}>
      <video ref={videoRef} autoPlay playsInline style={videoStyle} />
    </div>
  );
};

export default VideoComponent;
