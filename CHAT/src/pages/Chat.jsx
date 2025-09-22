/**
 * Chat Page Component
 * KSVID Chat Application - Main chat interface
 * Author: Kirety
 */

import React, { useEffect, useState, useRef } from 'react';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import Contacts from '../components/Contacts';
import ChatContainer from '../components/ChatContainer';
import VideoCall from '../components/VideoCall';
import VoiceCall from '../components/VoiceCall';
import axios from 'axios';
import { allUsersRoute, host } from "../utils/APIRoutes";
import robot from "../assets/robot.gif";
import { io } from 'socket.io-client';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: #f5f7fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  .chat-container {
    display: flex;
    width: 100%;
    height: 100%;
    max-width: 1400px;
    margin: 0 auto;
    background: white;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }

  .contacts-section {
    width: 320px;
    min-width: 280px;
    background: #ffffff;
    border-right: 1px solid #e1e5e9;
    display: flex;
    flex-direction: column;
  }

  .chat-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fafbfc;
    position: relative;
  }

  .welcome-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #6c757d;
    text-align: center;
    padding: 2rem;
  }

  .welcome-screen img {
    width: 200px;
    height: 200px;
    margin-bottom: 2rem;
    opacity: 0.8;
  }

  .welcome-screen h2 {
    font-size: 1.5rem;
    font-weight: 300;
    margin-bottom: 0.5rem;
    color: #495057;
  }

  .welcome-screen p {
    font-size: 1rem;
    color: #6c757d;
    margin: 0;
  }

  .back-button {
    display: none;
    position: absolute;
    top: 15px;
    left: 15px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 1.2rem;
    z-index: 100;
    transition: background 0.2s ease;
  }

  .back-button:hover {
    background: #0056b3;
  }

  /* Incoming Call Overlay - Perfect Styling */
  .incoming-call-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 50, 0.98) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(8px);
    animation: flashBackground 1.5s infinite;
    user-select: none;
  }

  .incoming-call-popup {
    background: linear-gradient(145deg, #ffffff 0%, #f8f9fc 50%, #e3f2ff 100%);
    padding: 3rem 2.5rem 2.5rem 2.5rem;
    border-radius: 30px;
    text-align: center;
    box-shadow: 
      0 25px 80px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    min-width: 420px;
    max-width: 500px;
    animation: slideUpBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), glowPulse 2s infinite;
    border: 2px solid transparent;
    background-clip: padding-box;
    position: relative;
    overflow: hidden;
  }

  .incoming-call-popup::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #007bff, #00c6ff, #007bff, #0056b3);
    background-size: 300% 300%;
    border-radius: 32px;
    z-index: -1;
    animation: gradientShift 3s ease infinite;
  }

  .call-icon-big {
    font-size: 5rem;
    margin-bottom: 1rem;
    animation: pulseBeat 1.5s infinite;
    text-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }

  .incoming-call-popup h1 {
    color: #1a1a2e;
    margin: 0.5rem 0;
    font-size: 2.2rem;
    font-weight: 800;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    letter-spacing: -0.5px;
  }

  .incoming-call-popup p {
    color: #4a5568;
    margin: 0.5rem 0 1.5rem 0;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .ring-animation {
    font-size: 3.5rem;
    margin: 1.5rem 0;
    animation: ringBounce 1s infinite, ringGlow 2s infinite;
    filter: drop-shadow(0 0 10px rgba(255, 193, 7, 0.8));
  }

  .call-buttons {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    margin-top: 2rem;
  }

  .accept-call-btn, .reject-call-btn {
    padding: 1.2rem 2.5rem;
    border: none;
    border-radius: 25px;
    font-size: 1.3rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    min-width: 140px;
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .accept-call-btn {
    background: linear-gradient(135deg, #28a745 0%, #20c997 50%, #17a2b8 100%);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .accept-call-btn:hover {
    background: linear-gradient(135deg, #218838 0%, #1e7e34 50%, #155724 100%);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 35px rgba(40, 167, 69, 0.4);
  }

  .accept-call-btn:active {
    transform: translateY(-1px) scale(1.02);
  }

  .reject-call-btn {
    background: linear-gradient(135deg, #dc3545 0%, #e74c3c 50%, #c0392b 100%);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .reject-call-btn:hover {
    background: linear-gradient(135deg, #c82333 0%, #bd2130 50%, #721c24 100%);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 35px rgba(220, 53, 69, 0.4);
  }

  .reject-call-btn:active {
    transform: translateY(-1px) scale(1.02);
  }

  /* Enhanced Animations */
  @keyframes slideUpBounce {
    0% {
      opacity: 0;
      transform: translateY(60px) scale(0.8);
    }
    70% {
      opacity: 0.9;
      transform: translateY(-10px) scale(1.05);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes pulseBeat {
    0%, 100% { 
      transform: scale(1); 
      opacity: 1;
    }
    25% { 
      transform: scale(1.1); 
      opacity: 0.8;
    }
    50% { 
      transform: scale(1.2); 
      opacity: 0.6;
    }
    75% { 
      transform: scale(1.1); 
      opacity: 0.8;
    }
  }

  @keyframes ringBounce {
    0%, 20%, 50%, 80%, 100% { 
      transform: translateY(0) rotate(0deg); 
    }
    40% { 
      transform: translateY(-15px) rotate(-5deg); 
    }
    60% { 
      transform: translateY(-8px) rotate(5deg); 
    }
  }

  @keyframes ringGlow {
    0%, 100% { 
      text-shadow: 0 0 10px rgba(255, 193, 7, 0.8), 0 0 20px rgba(255, 193, 7, 0.4);
    }
    50% { 
      text-shadow: 0 0 20px rgba(255, 193, 7, 1), 0 0 30px rgba(255, 193, 7, 0.6), 0 0 40px rgba(255, 193, 7, 0.3);
    }
  }

  @keyframes flashBackground {
    0%, 100% { 
      background: radial-gradient(circle, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 50, 0.98) 100%);
    }
    50% { 
      background: radial-gradient(circle, rgba(20, 50, 100, 0.95) 0%, rgba(0, 20, 80, 0.98) 100%);
    }
  }

  @keyframes glowPulse {
    0%, 100% { 
      box-shadow: 
        0 25px 80px rgba(0, 0, 0, 0.6),
        0 0 0 1px rgba(255, 255, 255, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    }
    50% { 
      box-shadow: 
        0 25px 80px rgba(0, 123, 255, 0.8),
        0 0 0 1px rgba(0, 123, 255, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.9),
        0 0 50px rgba(0, 123, 255, 0.5);
    }
  }

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .chat-container {
      box-shadow: none;
    }

    .contacts-section {
      width: 100%;
      position: ${props => props.$showChat ? 'absolute' : 'static'};
      left: ${props => props.$showChat ? '-100%' : '0'};
      transition: left 0.3s ease;
      z-index: 10;
    }

    .chat-section {
      width: 100%;
      position: ${props => props.$showChat ? 'static' : 'absolute'};
      right: ${props => !props.$showChat ? '-100%' : '0'};
      transition: right 0.3s ease;
    }

    .back-button {
      display: ${props => props.$showChat ? 'flex' : 'none'};
      align-items: center;
      justify-content: center;
    }
    
    .welcome-screen {
      img {
        width: 150px;
        height: 150px;
        margin-bottom: 1.5rem;
      }
      
      h2 {
        font-size: 1.3rem;
      }
      
      p {
        font-size: 0.9rem;
      }
    }

    /* Mobile Incoming Call Styling */
    .incoming-call-popup {
      min-width: 320px;
      max-width: 90vw;
      padding: 2.5rem 2rem;
      margin: 1rem;
    }

    .incoming-call-popup h1 {
      font-size: 1.8rem;
    }

    .incoming-call-popup p {
      font-size: 1.1rem;
    }

    .call-icon-big {
      font-size: 4rem;
    }

    .ring-animation {
      font-size: 3rem;
    }

    .call-buttons {
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    .accept-call-btn, .reject-call-btn {
      width: 100%;
      max-width: 250px;
      padding: 1rem 2rem;
      font-size: 1.1rem;
    }
  }
  
  @media (max-width: 480px) {
    .back-button {
      width: 36px;
      height: 36px;
      top: 12px;
      left: 12px;
      font-size: 1rem;
    }
    
    .welcome-screen {
      padding: 1rem;
      
      img {
        width: 120px;
        height: 120px;
        margin-bottom: 1rem;
      }
      
      h2 {
        font-size: 1.2rem;
        margin-bottom: 0.4rem;
      }
      
      p {
        font-size: 0.85rem;
      }
    }
  }
`;

export default function Chat() {
  const socket = useRef();
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  // Call-related states
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isVoiceCall, setIsVoiceCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callType, setCallType] = useState(null);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleBackToContacts = () => {
    setCurrentChat(undefined);
  };

  // Call handlers
  const handleVoiceCall = () => {
    if (currentChat && socket.current) {
      console.log('🔄 Initiating voice call to:', currentChat.username);
      
      // Emit voice call event to server
      socket.current.emit('voice-call', {
        to: currentChat._id,
        from: currentUser._id,
        callerName: currentUser.username,
        roomId: `${currentUser._id}-${currentChat._id}`,
        signal: null // Will be set up by WebRTC
      });
      
      // Set up outgoing call interface
      setIsVoiceCall(true);
      setCallType('voice');
      
      console.log('📞 Voice call initiated');
    }
  };

  const handleVideoCall = () => {
    if (currentChat && socket.current) {
      console.log('🔄 Initiating video call to:', currentChat.username);
      
      // Emit video call event to server
      socket.current.emit('video-call', {
        to: currentChat._id,
        from: currentUser._id,
        callerName: currentUser.username,
        roomId: `${currentUser._id}-${currentChat._id}`,
        signal: null // Will be set up by WebRTC
      });
      
      // Set up outgoing call interface
      setIsVideoCall(true);
      setCallType('video');
      
      console.log('📹 Video call initiated');
    }
  };

  const handleEndCall = () => {
    setIsVoiceCall(false);
    setIsVideoCall(false);
    setIncomingCall(null);
    setCallType(null);
  };

  useEffect(() => {
    const checkUser = async () => {
      const user = localStorage.getItem('chat-app-user');
      if (!user) {
        navigate('/login');
      } else {
        const storedUser = JSON.parse(user);
        setCurrentUser(storedUser);
        setIsLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit('add-user', currentUser._id);
      
      // Listen for incoming calls
      socket.current.on('incoming-voice-call', (callData) => {
        console.log('🔊 INCOMING VOICE CALL detected!');
        console.log('📞 Call details:', callData);
        
        setIncomingCall({ ...callData, type: 'voice' });
        setCallType('voice');
        
        // Make sure to show some visual indication
        alert('📞 INCOMING VOICE CALL from ' + callData.from + '! Check the overlay to answer.');
        
        // Play notification sound
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLQdFKxMNlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlW8vDpIgK9jGQJzMOzz8vP/M5Zds');
          audio.play().catch(() => console.log('Audio notification failed'));
        } catch (error) {
          console.log('Audio notification error:', error);
        }
      });

      socket.current.on('incoming-video-call', (callData) => {
        console.log('📹 INCOMING VIDEO CALL detected!');
        console.log('📞 Call details:', callData);
        
        setIncomingCall({ ...callData, type: 'video' });
        setCallType('video');
        
        // Make sure to show some visual indication
        alert('📹 INCOMING VIDEO CALL from ' + callData.from + '! Check the overlay to answer.');
        
        // Play notification sound
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLQdFKxMNlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlS8rDpUvKw6VLysOlW8vDpIgK9jGQJzMOzz8vP/M5Zds');
          audio.play().catch(() => console.log('Audio notification failed'));
        } catch (error) {
          console.log('Audio notification error:', error);
        }
      });

      // Handle call responses
      socket.current.on('call-accepted', (data) => {
        console.log('Call accepted by:', data.from);
        // The call components will handle the WebRTC signaling
      });

      socket.current.on('call-rejected', () => {
        console.log('Call was rejected');
        handleEndCall();
      });

      socket.current.on('call-ended', () => {
        console.log('Call ended');
        handleEndCall();
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        try {
          const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } catch (error) {
          console.error('Failed to fetch contacts', error);
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  if (isLoading) {
    return (
      <Container>
        <div className="chat-container">
          <div className="welcome-screen">
            <h2>Loading...</h2>
            <p>Please wait while we set up your chat</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!currentUser) {
    return (
      <Container>
        <div className="chat-container">
          <div className="welcome-screen">
            <h2>Authentication Required</h2>
            <p>Please log in to access the chat</p>
          </div>
        </div>
      </Container>
    );
  }



  return (
  <Container $showChat={!!currentChat}>


      {/* Incoming Call Overlay */}
      {incomingCall && (
        <div className="incoming-call-overlay">
          <div className="incoming-call-popup">
            <div className="call-icon-big">
              {callType === 'video' ? '📹' : '📞'}
            </div>
            <h1>
              🔔 INCOMING {callType === 'video' ? 'VIDEO' : 'VOICE'} CALL
            </h1>
            <p>
              From: <strong style={{color: '#007bff', fontSize: '1.4rem'}}>{incomingCall.from}</strong>
            </p>
            <div className="ring-animation">📞</div>
            <div className="call-buttons">
              <button 
                className="accept-call-btn"
                onClick={() => {
                  console.log('🟢 Accepting incoming call:', callType, 'from:', incomingCall.from);
                  
                  // First, emit accept-call to the server
                  socket.current.emit('accept-call', {
                    to: incomingCall.fromUserId,
                    signal: null // Will be handled by WebRTC peer
                  });
                  
                  // Set the current chat to the caller if not already set
                  if (!currentChat || currentChat._id !== incomingCall.fromUserId) {
                    const callerChat = {
                      _id: incomingCall.fromUserId,
                      username: incomingCall.from,
                      email: incomingCall.from + '@example.com'
                    };
                    setCurrentChat(callerChat);
                  }
                  
                  // Clear the incoming call overlay first
                  setIncomingCall(null);
                  
                  // Set up the call interface based on call type
                  if (callType === 'video') {
                    setIsVideoCall(true);
                    setIsVoiceCall(false);
                  } else {
                    setIsVoiceCall(true);
                    setIsVideoCall(false);
                  }
                  
                  console.log('✅ Call accepted and interface set up');
                }}
              >
                ✅ ANSWER CALL
              </button>
              <button 
                className="reject-call-btn"
                onClick={() => {
                  console.log('🔴 Rejecting incoming call from:', incomingCall.from);
                  socket.current.emit('reject-call', {
                    to: incomingCall.fromUserId
                  });
                  setIncomingCall(null);
                  setCallType(null);
                  console.log('❌ Call rejected');
                }}
              >
                ❌ REJECT
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="chat-container">
        {/* Contacts Section */}
        <div className="contacts-section">
          <Contacts 
            contacts={contacts} 
            currentUser={currentUser} 
            changeChat={handleChatChange} 
          />
        </div>

        {/* Chat Section */}
        <div className="chat-section">
          {currentChat && (
            <button className="back-button" onClick={handleBackToContacts}>
              ←
            </button>
          )}
          
          {currentChat ? (
            <ChatContainer 
              currentChat={currentChat} 
              currentUser={currentUser} 
              socket={socket}
              onVoiceCall={handleVoiceCall}
              onVideoCall={handleVideoCall}
            />
          ) : (
            <div className="welcome-screen">
              <img src={robot} alt="Welcome Robot" />
              <h2>Welcome to KSVID Chat</h2>
              <p>Select a contact to start chatting</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Call Components */}
      {isVoiceCall && (
        <VoiceCall
          socket={socket}
          currentUser={currentUser}
          currentChat={currentChat}
          onEndCall={handleEndCall}
          isIncoming={incomingCall ? true : false}
        />
      )}
      
      {isVideoCall && (
        <VideoCall
          socket={socket}
          currentUser={currentUser}
          currentChat={currentChat}
          onEndCall={handleEndCall}
          isIncoming={incomingCall ? true : false}
        />
      )}
    </Container>
  );
}
