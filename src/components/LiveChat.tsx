import { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, off, Database } from 'firebase/database';

// Firebase configuration - using demo config (replace with your own)
const firebaseConfig = {
  apiKey: "AIzaSyDemoKey",
  authDomain: "cubanlink-chat.firebaseapp.com",
  databaseURL: "https://cubanlink-chat-default-rtdb.firebaseio.com",
  projectId: "cubanlink-chat",
  storageBucket: "cubanlink-chat.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo"
};

// Initialize Firebase
let app;
let database: Database | null = null;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} catch (error) {
  console.warn('Firebase initialization failed, using mock chat:', error);
}

interface Message {
  id: string;
  text: string;
  timestamp: number;
  user: string;
}

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!database) return;

    const messagesRef_db = ref(database, 'messages');
    
    onValue(messagesRef_db, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList: Message[] = Object.entries(data).map(([id, msg]: [string, any]) => ({
          id,
          text: msg.text,
          timestamp: msg.timestamp,
          user: msg.user || 'Anonymous'
        }));
        messagesList.sort((a, b) => a.timestamp - b.timestamp);
        messagesRef.current = messagesList.slice(-50); // Keep last 50 messages
        setMessages(messagesRef.current);
      }
    });

    return () => {
      off(messagesRef_db, 'value');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !database) return;

    const newMessage = {
      text: inputText.trim(),
      timestamp: Date.now(),
      user: userName || `User${Math.floor(Math.random() * 10000)}`
    };

    push(ref(database, 'messages'), newMessage);
    setInputText('');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (chatWindowRef.current) {
      setIsDragging(true);
      const rect = chatWindowRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && chatWindowRef.current) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Constrain to viewport
        const maxX = window.innerWidth - chatWindowRef.current.offsetWidth;
        const maxY = window.innerHeight - chatWindowRef.current.offsetHeight;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragStart]);

  return (
    <div className={`live-chat-container ${isOpen ? 'chat-open' : ''}`}>
      <button 
        className="chat-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="chat-toggle-icon">💬</span>
        <span className="chat-toggle-text">LIVE CHAT</span>
      </button>

      {isOpen && (
        <div 
          ref={chatWindowRef}
          className="chat-window"
          style={{
            left: position.x === 0 ? 'auto' : `${position.x}px`,
            top: position.y === 0 ? 'auto' : `${position.y}px`,
            right: position.x === 0 ? '0' : 'auto',
            bottom: position.y === 0 ? '0' : 'auto',
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
          <div 
            className="chat-header"
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <h3>LIVE CHAT</h3>
            <button className="chat-close" onClick={() => setIsOpen(false)}>×</button>
          </div>

          {!userName && (
            <div className="chat-name-input-container">
              <input
                type="text"
                placeholder="Enter your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="chat-name-input"
                maxLength={20}
              />
            </div>
          )}

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty">No messages yet. Be the first to chat!</div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="chat-message">
                  <div className="chat-message-header">
                    <span className="chat-user">{msg.user}</span>
                    <span className="chat-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="chat-text">{msg.text}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="chat-input"
              maxLength={200}
              disabled={!userName}
            />
            <button type="submit" className="chat-send-button" disabled={!inputText.trim() || !userName}>
              SEND
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
