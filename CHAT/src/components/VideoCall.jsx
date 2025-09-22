/**
 * VideoCall Component
 * KSVID Chat Application - Handles video calling functionality using WebRTC
 * Author: Kirety
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Peer from 'simple-peer';
import { 
  MdCallEnd, 
  MdMic, 
  MdMicOff, 
  MdVideocam, 
  MdVideocamOff,
  MdVolumeUp,
  MdVolumeOff
} from 'react-icons/md';

export default function VideoCall({ 
  socket, 
  currentUser, 
  currentChat, 
  onEndCall,
  isIncoming = false,
  callerSignal = null 
}) {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignalData, setCallerSignalData] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    // Get user media (camera and microphone)
    navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    }).then((currentStream) => {
      console.log("✅ Media access granted for video call");
      setStream(currentStream);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }
    }).catch((error) => {
      console.error("❌ Error accessing media devices:", error);
      alert("Please allow camera and microphone access for video calls to work properly.");
    });

    // Handle incoming call if this is an incoming call
    if (isIncoming && callerSignal) {
      setReceivingCall(true);
      setCaller(callerUsername || 'Unknown User');
      setCallerSignalData(callerSignal);
    }

    // Socket event listeners for call responses
    socket.current.on("call-accepted", ({ signal }) => {
      setCallAccepted(true);
      if (connectionRef.current) {
        connectionRef.current.signal(signal);
      }
    });

    socket.current.on("call-rejected", () => {
      setCallEnded(true);
      onEndCall();
    });

    socket.current.on("call-ended", () => {
      setCallEnded(true);
      endCall();
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Auto-initiate call only for outgoing calls, not incoming
  useEffect(() => {
    if (stream && !isIncoming && !receivingCall && !callAccepted) {
      // Auto-call for outgoing calls
      const timer = setTimeout(() => {
        console.log('🔄 Auto-initiating outgoing video call...');
        callUser();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stream, isIncoming]);

  // Listen for incoming calls
  useEffect(() => {
    if (socket.current) {
      socket.current.on("incoming-video-call", (data) => {
        console.log('📹 VideoCall component received incoming call:', data);
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignalData(data.signal);
      });

      return () => {
        socket.current.off("incoming-video-call");
      };
    }
  }, []);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("video-call", {
        to: currentChat._id,
        from: currentUser._id,
        callerName: currentUser.username,
        signal: data,
        roomId: `${currentUser._id}-${currentChat._id}`
      });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.current.on("call-accepted", ({ signal }) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const acceptCall = () => {
    console.log('✅ Accepting video call from:', caller);
    setCallAccepted(true);
    setReceivingCall(false);
    
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      console.log('🔄 Sending accept signal to caller');
      socket.current.emit("accept-call", {
        signal: data,
        to: currentChat._id, // Use currentChat._id instead of caller
        from: currentUser._id
      });
    });

    peer.on("stream", (currentStream) => {
      console.log('📺 Received video stream from caller');
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    if (callerSignalData) {
      peer.signal(callerSignalData);
    }
    
    connectionRef.current = peer;
  };

  const rejectCall = () => {
    setReceivingCall(false);
    socket.current.emit("reject-call", {
      to: caller,
      from: currentUser._id
    });
    onEndCall();
  };

  const endCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    socket.current.emit("end-call", {
      to: currentChat._id,
      from: currentUser._id
    });
    onEndCall();
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleSpeaker = () => {
    if (userVideo.current) {
      userVideo.current.muted = !userVideo.current.muted;
      setIsSpeakerOff(!isSpeakerOff);
    }
  };

  if (callEnded) {
    return null;
  }

  return (
    <Container>
      <div className="video-container">
        <div className="videos">
          {/* My Video */}
          <div className="video-wrapper my-video">
            {stream && (
              <video 
                ref={myVideo} 
                muted 
                autoPlay 
                playsInline
                className={isVideoOff ? 'video-off' : ''}
              />
            )}
            <div className="video-label">You</div>
          </div>

          {/* Other User's Video */}
          {callAccepted && (
            <div className="video-wrapper user-video">
              <video 
                ref={userVideo} 
                autoPlay 
                playsInline
                muted={isSpeakerOff}
              />
              <div className="video-label">{currentChat.username}</div>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="call-controls">
          <button 
            onClick={toggleMute} 
            className={`control-btn ${isMuted ? 'muted' : ''}`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MdMicOff /> : <MdMic />}
          </button>

          <button 
            onClick={toggleVideo} 
            className={`control-btn ${isVideoOff ? 'video-off' : ''}`}
            title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoOff ? <MdVideocamOff /> : <MdVideocam />}
          </button>

          <button 
            onClick={toggleSpeaker} 
            className={`control-btn ${isSpeakerOff ? 'speaker-off' : ''}`}
            title={isSpeakerOff ? 'Turn on speaker' : 'Turn off speaker'}
          >
            {isSpeakerOff ? <MdVolumeOff /> : <MdVolumeUp />}
          </button>

          <button 
            onClick={endCall} 
            className="control-btn end-call"
            title="End call"
          >
            <MdCallEnd />
          </button>
        </div>

        {/* Call Actions */}
        {!callAccepted && !receivingCall && (
          <div className="call-actions">
            <button onClick={callUser} className="call-btn">
              Call {currentChat.username}
            </button>
          </div>
        )}

        {receivingCall && !callAccepted && (
          <div className="incoming-call">
            <div className="call-icon">📹</div>
            <h3>Incoming Video Call</h3>
            <p>From: <strong>{currentChat.username}</strong></p>
            <div className="call-ring">📞</div>
            <div className="call-actions">
              <button onClick={acceptCall} className="accept-btn">
                ✅ Accept Call
              </button>
              <button onClick={rejectCall} className="reject-btn">
                ❌ Reject Call
              </button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #1a1a1a;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  .video-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .videos {
    flex: 1;
    display: flex;
    gap: 1rem;
    padding: 1rem;
    position: relative;
  }

  .video-wrapper {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: #2a2a2a;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
      
      &.video-off {
        opacity: 0;
      }
    }

    .video-label {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 500;
    }
  }

  .my-video {
    width: 250px;
    height: 180px;
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
  }

  .user-video {
    flex: 1;
    height: 100%;
  }

  .call-controls {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1rem;
    background: rgba(0, 0, 0, 0.8);
    padding: 1rem 2rem;
    border-radius: 50px;
    backdrop-filter: blur(10px);
  }

  .control-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    &.muted, &.video-off, &.speaker-off {
      background: #ff4444;
    }

    &.end-call {
      background: #ff4444;

      &:hover {
        background: #cc3333;
      }
    }
  }

  .call-actions {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    gap: 1rem;
  }

  .call-btn, .accept-btn, .reject-btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .call-btn, .accept-btn {
    background: #4CAF50;
    color: white;

    &:hover {
      background: #45a049;
    }
  }

  .reject-btn {
    background: #f44336;
    color: white;

    &:hover {
      background: #da190b;
    }
  }

  .incoming-call {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    color: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);

    .call-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      animation: pulse 2s infinite;
    }

    .call-ring {
      font-size: 2rem;
      margin: 1rem 0;
      animation: bounce 1s infinite;
    }

    h3 {
      margin-bottom: 0.5rem;
      font-size: 1.4rem;
    }

    p {
      margin-bottom: 1.5rem;
      font-size: 1rem;
      color: #ccc;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .videos {
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem;
    }

    .my-video {
      width: 120px;
      height: 90px;
      top: 10px;
      right: 10px;
    }

    .call-controls {
      bottom: 20px;
      padding: 0.8rem 1.5rem;
      gap: 0.8rem;
    }

    .control-btn {
      width: 45px;
      height: 45px;
      font-size: 1.3rem;
    }

    .incoming-call {
      padding: 1.5rem;
      margin: 1rem;
      
      h3 {
        font-size: 1rem;
      }
    }

    .call-btn, .accept-btn, .reject-btn {
      padding: 0.8rem 1.5rem;
      font-size: 0.9rem;
    }
  }
`;