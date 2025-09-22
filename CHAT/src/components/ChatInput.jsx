// RADHAKRISHNALOVEPERMANTLUUUUUU
// AMMANANNANMKRSPVLIDATAOPERMAENTN
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import { MdAttachFile, MdClose } from "react-icons/md";
import { uploadFileRoute } from "../utils/APIRoutes";
import axios from "axios";
import { toast } from "react-toastify";

export default function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiBtnRef = useRef(null);
  const fileInputRef = useRef(null);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emojiObject) => {
    setMsg((prevMsg) => prevMsg + emojiObject.emoji);
  };
  
  // Handle file selection with preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // For non-image files, set preview to null
        setFilePreview(null);
      }
    }
  };
  
  // Clear selected file
  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    if (file) {
      setUploading(true);
      // Show temp uploading message
      const tempId = Date.now();
      handleSendMsg({
        type: 'uploading',
        fileName: file.name,
        tempId,
      });
      
      const formData = new FormData();
      formData.append("file", file);
      
      axios.post(uploadFileRoute, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((response) => {
          setUploading(false);
          clearFile();
          if (response.data.fileUrl) {
            handleSendMsg({
              type: 'file',
              url: response.data.fileUrl,
              fileName: file.name,
              tempId,
            });
          }
        })
        .catch((error) => {
          console.error("File upload error:", error);
          setUploading(false);
          clearFile();
          toast.error("Failed to upload file. Please try again.");
        });
    } else if (msg.trim().length > 0) {
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
          disabled={uploading}
        />
        
        {/* File preview area */}
        {(file || filePreview) && (
          <div className="file-preview">
            {filePreview && file.type.startsWith('image/') ? (
              <div className="image-preview">
                <img src={filePreview} alt="Preview" />
                <button type="button" onClick={clearFile} className="clear-file">
                  <MdClose />
                </button>
              </div>
            ) : file ? (
              <div className="file-badge">
                <span>{file.name}</span>
                <button type="button" onClick={clearFile} className="clear-file">
                  <MdClose />
                </button>
              </div>
            ) : null}
          </div>
        )}
        
        <div className="action-buttons">
          <label className="file-label">
            <MdAttachFile />
            <input
              ref={fileInputRef}
              type="file"
              accept="*/*" 
              onChange={handleFileChange}
              disabled={uploading}
              className="file-input"
            />
          </label>
          <button type="submit" className="submit" disabled={uploading}>
            {uploading ? "Uploading..." : <IoMdSend />}
          </button>
        </div>
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
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    background: white;
    padding: 0.4rem 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 1rem;
    position: relative;
  }
  
  .file-preview {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 0.5rem 0;
    position: relative;
    
    .image-preview {
      position: relative;
      max-width: 200px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      
      img {
        max-width: 100%;
        max-height: 150px;
        display: block;
      }
    }
    
    .file-badge {
      display: flex;
      align-items: center;
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
      color: #333;
      max-width: 90%;
      
      span {
        max-width: calc(100% - 30px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    
    .clear-file {
      position: absolute;
      right: -10px;
      top: -10px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      
      &:hover {
        background: #f5f5f5;
      }
    }
  }
  
  .action-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
  }
  
  .file-label {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #2196f3;
    font-size: 1.5rem;
    transition: transform 0.2s;
    
    &:hover {
      transform: scale(1.1);
    }
  }
  
  .file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
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
    .file-preview {
      .image-preview {
        max-width: 150px;
        img {
          max-height: 120px;
        }
      }
    }
  }
  @media (max-width: 600px) {
    .input-container {
      padding: 0.2rem 0.5rem 0.5rem 0.5rem;
      border-radius: 0 0 0.5rem 0.5rem;
      flex-direction: column;
      
      .emoji {
        align-self: flex-start;
        margin-left: 0.5rem;
      }
      
      input[type="text"] {
        width: 100%;
        font-size: 0.98rem;
        padding: 0.5rem;
        margin-bottom: 0.3rem;
        border: 1px solid #e0e0e0;
        border-radius: 1rem;
      }
    }
    
    .file-preview {
      margin: 0.3rem 0;
      
      .image-preview {
        max-width: 120px;
        img {
          max-height: 100px;
        }
      }
      
      .file-badge {
        font-size: 0.8rem;
        padding: 0.3rem 0.6rem;
        max-width: 220px;
        margin: 0 auto;
      }
      
      .clear-file {
        right: -5px;
        top: -5px;
        width: 20px;
        height: 20px;
        font-size: 0.8rem;
      }
    }
    
    .action-buttons {
      width: 100%;
      justify-content: space-between;
      padding: 0 0.5rem;
      
      .file-label {
        font-size: 1.3rem;
      }
      
      button.submit {
        padding: 0.4rem 0.8rem;
        
        svg {
          font-size: 1.2rem;
        }
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
  
  @media (max-width: 480px) {
    .input-container {
      padding: 0.2rem 0.4rem 0.4rem 0.4rem;
      
      input[type="text"] {
        font-size: 0.9rem;
        padding: 0.4rem;
      }
    }
    
    .file-preview {
      .image-preview {
        max-width: 100px;
        img {
          max-height: 80px;
        }
      }
      
      .file-badge {
        font-size: 0.75rem;
        padding: 0.3rem 0.5rem;
        max-width: 200px;
      }
    }
    
    .action-buttons {
      padding: 0 0.3rem;
      
      .file-label {
        font-size: 1.2rem;
      }
      
      button.submit {
        padding: 0.35rem 0.7rem;
        
        svg {
          font-size: 1.1rem;
        }
      }
    }
  }
`;
