import React, { useState, useEffect, CSSProperties } from 'react';
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

  // Inline CSS styles
  const styles: { [key: string]: CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '400px',
      width: '300px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '10px',
      backgroundColor: '#f9f9f9',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      marginBottom: '10px',
    },
    message: {
      margin: '5px 0',
      padding: '8px',
      borderRadius: '5px',
    },
    myMessage: {
      backgroundColor: '#e0f7fa',
      alignSelf: 'flex-end',
    },
    otherMessage: {
      backgroundColor: '#fff',
      alignSelf: 'flex-start',
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    input: {
      flex: 1,
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '8px 12px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.userId === userId ? styles.myMessage : styles.otherMessage),
            }}
          >
            <strong>{msg.userId === userId ? 'You' : msg.userId}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message..."
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
