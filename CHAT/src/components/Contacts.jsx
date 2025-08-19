/**
 * Contacts Component
 * KSVID Chat Application - Display user contacts and current user info
 * Author: Kirety
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import multiavatar from "@multiavatar/multiavatar";

export default function Contacts({ contacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const handleContactClick = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserName && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>snappy</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                onClick={() => handleContactClick(index, contact)}
              >
                <div className="avatar"></div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="current-user">
            <div className="avatar"></div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-right: 1px solid #e0e0e0;
  min-width: 270px;
  max-width: 370px;
  justify-content: space-between;

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1.5rem;
    border-bottom: 1px solid #f0f0f0;

    img {
      height: 2.2rem;
    }

    h3 {
      color: #333;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
      font-size: 1.3rem;
      margin: 0;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    overflow-y: auto;
    padding: 1.2rem 0.8rem;
    scrollbar-width: thin;
    scrollbar-color: #ddd #f5f5f5;

    &::-webkit-scrollbar {
      width: 0.25rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 1rem;
    }

    .contact {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.7rem 1rem;
      margin-bottom: 0.5rem;
      border-radius: 0.7rem;
      background: transparent;
      cursor: pointer;
      transition: background 0.2s;

      .avatar img {
        height: 2.7rem;
        width: 2.7rem;
        border-radius: 50%;
        background: #f5f5f5;
        border: 1px solid #e0e0e0;
        transition: transform 0.2s;
      }

      .username h3 {
        color: #333;
        font-size: 1.08rem;
        font-weight: 600;
        margin: 0;
        letter-spacing: 0.5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 150px;
      }

      &:hover {
        background: #f5f5f5;
        border-radius: 0.5rem;
      }
    }

    .contact.selected {
      background: #e3f2fd;
      border: 1px solid #2196f3;
      .username h3 {
        color: #1976d2;
      }
    }
  }

  .current-user {
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.2rem;
    border-top: 1px solid #e0e0e0;
    padding: 1.1rem;

    .avatar img {
      height: 3.2rem;
      width: 3.2rem;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #e0e0e0;
    }

    .username h2 {
      color: #333;
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      letter-spacing: 1px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 150px;
    }
  }

  /* Responsive */
  @media (max-width: 900px) {
    min-width: 180px;
    max-width: 240px;
    .brand h3 { font-size: 1.05rem; }
    .contacts .contact .username h3,
    .current-user .username h2 { max-width: 80px; font-size: 1rem; }
    .contacts .contact .avatar img,
    .current-user .avatar img { height: 2.1rem; width: 2.1rem; }
  }
  @media (max-width: 600px) {
    min-width: 90px;
    max-width: 100vw;
    .brand h3 { font-size: 0.9rem; }
    .contacts .contact .username h3,
    .current-user .username h2 { max-width: 50px; font-size: 0.85rem; }
    .contacts .contact .avatar img,
    .current-user .avatar img { height: 1.3rem; width: 1.3rem; }
    .contacts { padding: 0.5rem 0 0.5rem 0; }
    .current-user { padding: 0.5rem 0 0.5rem 0; }
  }
`;
