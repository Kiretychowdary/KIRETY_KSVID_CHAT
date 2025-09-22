/**
 * VoiceCall Component
 * KSVID Chat Application - Handles voice calling functionality using WebRTC
 * Author: Kirety
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Peer from 'simple-peer';
import { 
  MdCallEnd, 
  MdMic, 
  MdMicOff, 
  MdVolumeUp,
  MdVolumeOff,
  MdPhone
} from 'react-icons/md';
import { BsPersonCircle } from 'react-icons/bs';

export default function VoiceCall({ 
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
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const userAudio = useRef();
  const connectionRef = useRef();
  const durationInterval = useRef();

  useEffect(() => {
    // Get user media (microphone only)
    navigator.mediaDevices.getUserMedia({ 
      video: false, 
      audio: true 
    }).then((currentStream) => {
      console.log("✅ Media access granted for voice call");
      setStream(currentStream);
    }).catch((error) => {
      console.error("❌ Error accessing microphone:", error);
      alert("Please allow microphone access for voice calls to work properly.");
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
      startCallTimer();
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
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, []);

  // Auto-initiate call only for outgoing calls, not incoming
  useEffect(() => {
    if (stream && !isIncoming && !receivingCall && !callAccepted) {
      // Auto-call for outgoing calls
      const timer = setTimeout(() => {
        console.log('🔄 Auto-initiating outgoing voice call...');
        callUser();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stream, isIncoming]);

  // Listen for incoming calls
  useEffect(() => {
    if (socket.current) {
      socket.current.on("incoming-voice-call", (data) => {
        console.log('📞 VoiceCall component received incoming call:', data);
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignalData(data.signal);
      });

      return () => {
        socket.current.off("incoming-voice-call");
      };
    }
  }, []);

  const startCallTimer = () => {
    durationInterval.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("voice-call", {
        to: currentChat._id,
        from: currentUser._id,
        callerName: currentUser.username,
        signal: data,
        roomId: `${currentUser._id}-${currentChat._id}`
      });
    });

    peer.on("stream", (currentStream) => {
      if (userAudio.current) {
        userAudio.current.srcObject = currentStream;
      }
    });

    socket.current.on("call-accepted", ({ signal }) => {
      setCallAccepted(true);
      peer.signal(signal);
      startCallTimer();
    });

    connectionRef.current = peer;
  };

  const acceptCall = () => {
    console.log('✅ Accepting voice call from:', caller);
    setCallAccepted(true);
    setReceivingCall(false);
    
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      console.log('🔄 Sending accept signal to voice caller');
      socket.current.emit("accept-call", {
        signal: data,
        to: currentChat._id, // Use currentChat._id instead of caller
        from: currentUser._id
      });
    });

    peer.on("stream", (currentStream) => {
      console.log('🔊 Received audio stream from caller');
      if (userAudio.current) {
        userAudio.current.srcObject = currentStream;
      }
    });

    if (callerSignalData) {
      peer.signal(callerSignalData);
    }
    
    connectionRef.current = peer;
    startCallTimer();
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
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
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

  const toggleSpeaker = () => {
    if (userAudio.current) {
      userAudio.current.muted = !userAudio.current.muted;
      setIsSpeakerOff(!isSpeakerOff);
    }
  };

  if (callEnded) {
    return null;
  }

  return (
    <Container>
      <div className="voice-call-container">
        {/* Hidden audio element for receiving audio */}
        <audio ref={userAudio} autoPlay />

        <div className="call-header">
          <div className="call-info">
            <div className="user-avatar">
              <BsPersonCircle />
            </div>
            <div className="user-details">
              <h3>{currentChat.username}</h3>
              {callAccepted ? (
                <p className="call-status">{formatDuration(callDuration)}</p>
              ) : receivingCall ? (
                <p className="call-status">Incoming call...</p>
              ) : (
                <p className="call-status">Calling...</p>
              )}
            </div>
          </div>
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
              <MdPhone />
              Call {currentChat.username}
            </button>
          </div>
        )}

        {receivingCall && !callAccepted && (
          <div className="incoming-call">
            <div className="incoming-info">
              <div className="call-icon">📞</div>
              <h3>Incoming Voice Call</h3>
              <p>From: <strong>{currentChat.username}</strong></p>
              <div className="call-ring">☎️</div>
            </div>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  .voice-call-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 2rem;
  }

  .call-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .call-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    color: white;
    border: 4px solid rgba(255, 255, 255, 0.3);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }

  .user-details {
    color: white;
    text-align: center;

    h3 {
      font-size: 1.8rem;
      font-weight: 600;
      margin: 0;
      margin-bottom: 0.5rem;
    }

    .call-status {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }
  }

  .call-controls {
    display: flex;
    gap: 2rem;
    background: rgba(0, 0, 0, 0.3);
    padding: 1.5rem 3rem;
    border-radius: 50px;
    backdrop-filter: blur(10px);
    margin-bottom: 2rem;
  }

  .control-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    &.muted, &.speaker-off {
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
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  .call-btn, .accept-btn, .reject-btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 140px;
    justify-content: center;
  }

  .call-btn, .accept-btn {
    background: #4CAF50;
    color: white;

    &:hover {
      background: #45a049;
      transform: translateY(-2px);
    }
  }

  .reject-btn {
    background: #f44336;
    color: white;

    &:hover {
      background: #da190b;
      transform: translateY(-2px);
    }
  }

  .incoming-call {
    text-align: center;
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    min-width: 300px;
  }

  .incoming-info {
    margin-bottom: 2rem;

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
      margin-bottom: 1rem;
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

  .caller-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: white;
    border: 3px solid rgba(255, 255, 255, 0.3);
    margin: 0 auto 1rem;
    animation: pulse 2s infinite;
  }

  .incoming-info h3 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
  }

  .incoming-info p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .voice-call-container {
      padding: 1.5rem;
    }

    .user-avatar, .caller-avatar {
      width: 100px;
      height: 100px;
      font-size: 3rem;
    }

    .user-details h3 {
      font-size: 1.5rem;
    }

    .user-details .call-status {
      font-size: 1rem;
    }

    .call-controls {
      gap: 1.5rem;
      padding: 1.2rem 2rem;
    }

    .control-btn {
      width: 50px;
      height: 50px;
      font-size: 1.5rem;
    }

    .call-btn, .accept-btn, .reject-btn {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
      min-width: 120px;
    }

    .incoming-info h3 {
      font-size: 1.3rem;
    }

    .incoming-info p {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .voice-call-container {
      padding: 1rem;
    }

    .call-header {
      margin-bottom: 2rem;
    }

    .user-avatar, .caller-avatar {
      width: 80px;
      height: 80px;
      font-size: 2.5rem;
    }

    .user-details h3 {
      font-size: 1.3rem;
    }

    .call-controls {
      gap: 1rem;
      padding: 1rem 1.5rem;
    }

    .control-btn {
      width: 45px;
      height: 45px;
      font-size: 1.3rem;
    }

    .call-actions {
      flex-direction: column;
      gap: 1rem;
    }

    .call-btn, .accept-btn, .reject-btn {
      width: 100%;
      max-width: 200px;
    }
  }
`;