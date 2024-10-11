import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface ChatComponentProps {
  socket: Socket;
  roomId: string;
  userId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ socket, roomId, userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ userId: string, message: string }[]>([]);

  useEffect(() => {
   
    socket.on('chat-message', (data: { message: string, userId: string }) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      socket.off('chat-message');
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('send-chat-message', roomId, message, userId);
      setMessage(''); 
    }
  };

  return (
    <div className="chat-component">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.userId === userId ? 'my-message' : 'other-message'}>
            <strong>{msg.userId === userId ? 'You' : msg.userId}: </strong>{msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
