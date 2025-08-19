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

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .chat-container {
      box-shadow: none;
    }

    .contacts-section {
      width: 100%;
      position: ${props => props.showChat ? 'absolute' : 'static'};
      left: ${props => props.showChat ? '-100%' : '0'};
      transition: left 0.3s ease;
      z-index: 10;
    }

    .chat-section {
      width: 100%;
      position: ${props => props.showChat ? 'static' : 'absolute'};
      right: ${props => props.showChat ? '0' : '-100%'};
      transition: right 0.3s ease;
    }

    .back-button {
      display: ${props => props.showChat ? 'flex' : 'none'};
      align-items: center;
      justify-content: center;
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

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleBackToContacts = () => {
    setCurrentChat(undefined);
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
    <Container showChat={!!currentChat}>
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
    </Container>
  );
}
