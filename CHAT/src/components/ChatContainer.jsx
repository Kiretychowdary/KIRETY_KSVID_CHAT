// radhakrishnalovepermanentluuuuashivaparvathivinyaka
import { sendMessageRoute, getMessagesRoute } from '../utils/APIRoutes';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import axios from 'axios';
import { MdPhone, MdVideocam } from 'react-icons/md';

export default function ChatContainer({ currentChat, currentUser, socket, onVoiceCall, onVideoCall }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        try {
          const response = await axios.post(getMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });

          console.log("📥 Message response:", response.data);

          // Use fallback in case response shape varies
          const msgs = response.data?.data || response.data || [];
          setMessages(msgs);
        } catch (error) {
          console.error("❌ Error fetching messages:", error);
          setMessages([]);
        }
      }
    };
    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-receive', (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMsg = async (msg) => {
    // If msg is an object, handle file upload preview logic
    if (typeof msg === 'object' && msg.type === 'uploading') {
      setMessages((prev) => [...prev, { fromSelf: true, uploading: true, fileName: msg.fileName, tempId: msg.tempId }]);
      return;
    }
    if (typeof msg === 'object' && msg.type === 'file') {
      // Replace temp uploading message with actual file message
      setMessages((prev) => {
        const filtered = prev.filter(m => !(m.uploading && m.tempId === msg.tempId));
        return [...filtered, { fromSelf: true, message: `File: ${msg.url}`, fileName: msg.fileName }];
      });
      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: `File: ${msg.url}`,
      });
      // Emit via socket for instant delivery to recipient
      if (socket.current) {
        socket.current.emit('send-msg', {
          to: currentChat._id,
          from: currentUser._id,
          message: `File: ${msg.url}`,
        });
      }
      return;
    }
    // Normal text message
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    if (socket.current) {
      socket.current.emit('send-msg', {
        to: currentChat._id,
        from: currentUser._id,
        message: msg,
      });
    }
    const newMessages = [...messages, { fromSelf: true, message: msg }];
    setMessages(newMessages);
  };

  return (
    <Container>
      <div className="chat-header">
        <div className="header-info">
          <h3>{currentChat?.username || "Chat"}</h3>
        </div>
        <div className="call-controls">
          <button 
            className="call-btn voice-call"
            onClick={() => {
              console.log('Voice call clicked');
              onVoiceCall && onVoiceCall();
            }}
            title="Voice call"
          >
            <span className="icon">📞</span>
          </button>
          <button 
            className="call-btn video-call"
            onClick={() => {
              console.log('Video call clicked');
              onVideoCall && onVideoCall();
            }}
            title="Video call"
          >
            <span className="icon">📹</span>
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {(messages || []).map((msg, index) => {
          // Show uploading preview
          if (msg.uploading) {
            return (
              <div ref={scrollRef} key={index} className={`message sent`}>
                <div className="content">
                  <p>Uploading: {msg.fileName}</p>
                </div>
              </div>
            );
          }
          // Detect Cloudinary file message
          let fileUrl = null;
          let fileType = null;
          let fileName = null;
          if (typeof msg.message === 'string' && msg.message.startsWith('File: https://res.cloudinary.com/')) {
            fileUrl = msg.message.replace('File: ', '').trim();
            // Try to extract file name from URL
            fileName = fileUrl.split('/').pop().split('?')[0];
            // Get file extension from URL
            const fileExt = fileName.split('.').pop().toLowerCase();
            
            // Identify file type by extension
            if (/^(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileExt)) {
              fileType = 'image';
            } else if (fileExt === 'pdf') {
              fileType = 'pdf';
            } else if (/^(doc|docx)$/i.test(fileExt)) {
              fileType = 'word';
            } else if (/^(xls|xlsx|csv)$/i.test(fileExt)) {
              fileType = 'spreadsheet';
            } else if (/^(ppt|pptx)$/i.test(fileExt)) {
              fileType = 'presentation';
            } else if (/^(mp4|webm|mov|avi|wmv)$/i.test(fileExt)) {
              fileType = 'video';
            } else if (/^(mp3|wav|ogg|flac)$/i.test(fileExt)) {
              fileType = 'audio';
            } else if (/^(zip|rar|7z|tar|gz)$/i.test(fileExt)) {
              fileType = 'archive';
            } else {
              fileType = 'other';
            }
          }
          return (
            <div
              ref={scrollRef}
              key={index}
              className={`message ${msg.fromSelf ? 'sent' : 'received'}`}
            >
              <div className="content">
                {fileUrl ? (
                  <div className="file-content">
                    {fileType === 'image' ? (
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="image-link">
                        <img src={fileUrl} alt="sent file" className="message-image" />
                        <span className="file-name">{fileName || 'Image'}</span>
                      </a>
                    ) : (
                      <a 
                        href={fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="file-link"
                      >
                        <div className="file-icon">
                          {fileType === 'pdf' && '📄'}
                          {fileType === 'word' && '📝'}
                          {fileType === 'spreadsheet' && '📊'}
                          {fileType === 'presentation' && '📑'}
                          {fileType === 'video' && '🎬'}
                          {fileType === 'audio' && '🎵'}
                          {fileType === 'archive' && '📦'}
                          {fileType === 'other' && '📎'}
                        </div>
                        <span className="file-name">{fileName || 'File'}</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <p>{msg.message}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <ChatInput handleSendMsg={handleSendMsg} />
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: white;
  overflow: hidden;

  .chat-header {
    padding: 1rem;
    background: #f5f5f5;
    color: #333;
    font-size: 1.2rem;
    font-weight: 600;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .header-info {
      flex: 1;
      text-align: center;
      
      h3 {
        margin: 0;
        font-size: 1.2rem;
      }
    }
    
    .call-controls {
      display: flex;
      gap: 0.8rem;
      
      .call-btn {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, #4a76a8, #365a8a);
        
        svg {
          font-size: 1.2rem;
          stroke-width: 0;
        }
        
  .icon {
    font-size: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
  }        &:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
        
        &:active {
          transform: scale(0.95);
        }
        
        &.voice-call {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          
          &:hover {
            background: linear-gradient(135deg, #45a049, #3d8b40);
            transform: scale(1.1) translateY(-2px);
            box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
          }
        }
        
        &.video-call {
          background: linear-gradient(135deg, #2196F3, #1976D2);
          color: white;
          
          &:hover {
            background: linear-gradient(135deg, #1976D2, #1565C0);
            transform: scale(1.1) translateY(-2px);
            box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
          }
        }
      }
    }
  }

  .chat-messages {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .message {
      display: flex;

      .content {
        max-width: 60%;
        padding: 0.7rem 1rem;
        border-radius: 1rem;
        font-size: 1rem;
        color: #333;
        word-wrap: break-word;
        
        .file-content {
          display: flex;
          flex-direction: column;
          
          a {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: inherit;
          }
          
          .image-link {
            max-width: 100%;
          }
          
          .message-image {
            max-width: 180px;
            border-radius: 8px;
            object-fit: contain;
          }
          
          .file-icon {
            font-size: 2rem;
            margin-bottom: 0.3rem;
          }
          
          .file-name {
            font-size: 0.85rem;
            margin-top: 0.3rem;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .file-link {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(0, 0, 0, 0.05);
            padding: 0.8rem 1rem;
            border-radius: 0.5rem;
            transition: transform 0.2s;
            
            &:hover {
              transform: translateY(-2px);
              background: rgba(0, 0, 0, 0.08);
            }
          }
        }
      }

      &.sent {
        justify-content: flex-end;

        .content {
          background-color: #2196f3;
          color: white;
        }
      }

      &.received {
        justify-content: flex-start;

        .content {
          background-color: #f0f0f0;
        }
      }
    }
  }

  .chat-input {
    padding: 1rem;
    border-top: 1px solid #e0e0e0;
    background-color: #f9f9f9;
  }

  @media (max-width: 768px) {
    .chat-header {
      font-size: 1rem;
      padding: 0.8rem;
      
      .header-info h3 {
        font-size: 1rem;
      }
      
      .call-controls {
        gap: 0.6rem;
        
        .call-btn {
          width: 36px;
          height: 36px;
          font-size: 1rem;
        }
      }
    }

    .chat-input {
      padding: 0.8rem;
    }

    .chat-messages {
      padding: 0.8rem;
      
      .message {
        .content {
          font-size: 0.95rem;
          max-width: 80%;
          
          .file-content {
            .message-image {
              max-width: 160px;
            }
            
            .file-icon {
              font-size: 1.8rem;
            }
            
            .file-name {
              font-size: 0.8rem;
              max-width: 130px;
            }
            
            .file-link {
              padding: 0.6rem 0.8rem;
            }
          }
        }
      }
    }
  }
  
  @media (max-width: 480px) {
    .chat-header {
      font-size: 0.95rem;
      padding: 0.7rem;
    }
    
    .chat-messages {
      padding: 0.7rem;
      
      .message {
        .content {
          font-size: 0.9rem;
          max-width: 85%;
          padding: 0.6rem 0.8rem;
          
          .file-content {
            .message-image {
              max-width: 140px;
            }
            
            .file-icon {
              font-size: 1.6rem;
            }
            
            .file-name {
              font-size: 0.75rem;
              max-width: 120px;
            }
          }
        }
      }
    }
  }
`;
