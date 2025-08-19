// radhakrishnalovepermanentluuuuashivaparvathivinyaka
import { sendMessageRoute, getMessagesRoute } from '../utils/APIRoutes';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import axios from 'axios';

export default function ChatContainer({ currentChat, currentUser, socket }) {
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
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    socket.current.emit('send-msg', {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });

    const newMessages = [...messages, { fromSelf: true, message: msg }];
    setMessages(newMessages);
  };

  return (
    <Container>
      <div className="chat-header">
        <h3>{currentChat?.username || "Chat"}</h3>
      </div>

      <div className="chat-messages">
        {(messages || []).map((msg, index) => (
          <div
            ref={scrollRef}
            key={index}
            className={`message ${msg.fromSelf ? 'sent' : 'received'}`}
          >
            <div className="content">
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
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
    text-align: center;
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
    }

    .chat-input {
      padding: 0.8rem;
    }

    .chat-messages {
      padding: 0.8rem;
    }

    .message .content {
      font-size: 0.95rem;
      max-width: 80%;
    }
  }
`;
