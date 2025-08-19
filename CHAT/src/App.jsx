/**
 * KSVID Chat Application - Main App Component
 * Handles routing and navigation for the chat application
 * Author: Kirety
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

// Import components
import Register from './pages/Register';
import Login from './pages/Login';
import SetAvatar from './pages/SetAvatar';
import Chat from './pages/Chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/avatar" element={<SetAvatar />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
