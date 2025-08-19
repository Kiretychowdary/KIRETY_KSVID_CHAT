// RADHAKRISHNALOVEPERMANTLUUUUUU
// AMMANANNANMKRSPVLIDATAOPERMAENTN
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";

export default function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");
  const emojiPickerRef = useRef(null);
  const emojiBtnRef = useRef(null);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emojiObject) => {
    setMsg((prevMsg) => prevMsg + emojiObject.emoji);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiBtnRef.current &&
        !emojiBtnRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const sendChat = (e) => {
    e.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <form className="input-container" onSubmit={sendChat}>
        <div className="emoji">
          <span ref={emojiBtnRef}>
            <BsEmojiSmile onClick={toggleEmojiPicker} />
          </span>
          {showEmojiPicker && (
            <div ref={emojiPickerRef}>
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button type="submit" className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  background: white;
  padding: 0;

  .input-container {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: white;
    padding: 0.4rem 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 1rem;
    position: relative;
  }

  .emoji {
    position: relative;
    display: flex;
    align-items: center;
    svg {
      font-size: 1.7rem;
      color: #ffa726;
      cursor: pointer;
      transition: transform 0.2s;
      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .EmojiPickerReact, .emoji-picker-react {
    position: absolute !important;
    bottom: 60px;
    left: 0;
    z-index: 10;
    box-shadow: 0 4px 24px rgba(0,0,0,0.1);
    border-radius: 1rem;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    color: #333;
    font-size: 1.15rem;
    padding-left: 1rem;
    &::selection {
      background-color: #e3f2fd;
    }
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: #999;
    }
  }

  button {
    background: #2196f3;
    border: none;
    padding: 0.5rem 0.9rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, transform 0.2s;
    svg {
      font-size: 1.3rem;
      color: white;
    }
    &:hover {
      background: #1976d2;
      transform: scale(1.05);
    }
  }

  @keyframes fadeInInput {
    0% { opacity: 0; transform: translateY(30px);}
    100% { opacity: 1; transform: translateY(0);}
  }
  @keyframes popInInput {
    0% { opacity: 0; transform: scale(0.8);}
    80% { opacity: 1; transform: scale(1.08);}
    100% { opacity: 1; transform: scale(1);}
  }

  /* Responsive */
  @media (max-width: 900px) {
    .input-container {
      padding: 0.3rem 0.7rem;
      border-radius: 0 0 0.7rem 0.7rem;
      input {
        font-size: 1rem;
      }
    }
    .emoji svg {
      font-size: 1.3rem;
    }
  }
  @media (max-width: 600px) {
    .input-container {
      padding: 0.2rem 0.2rem;
      border-radius: 0 0 0.3rem 0.3rem;
      input {
        font-size: 0.98rem;
        padding-left: 0.5rem;
      }
      button {
        padding: 0.3rem 0.6rem;
      }
    }
    .emoji svg {
      font-size: 1.1rem;
    }
    .EmojiPickerReact, .emoji-picker-react {
      width: 95vw !important;
      min-width: 0 !important;
      left: 0 !important;
      right: 0 !important;
      border-radius: 0.7rem;
    }
  }
`;
