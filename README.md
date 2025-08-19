# KSVID Chat Application

A real-time chat application built with React.js frontend and Node.js/Express backend, using Socket.io for real-time messaging and MongoDB for data storage.

## 🚀 Features

- **Real-time messaging** with Socket.io
- **User authentication** (Register/Login)
- **User avatar system** (optional)
- **Responsive design** for mobile and desktop
- **Professional UI/UX** with styled-components
- **Secure password hashing** with bcrypt
- **MongoDB database** for data persistence
- **CORS enabled** for cross-origin requests

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Styled Components
- Socket.io Client
- Axios
- React Toastify
- Multiavatar

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB with Mongoose
- bcrypt for password hashing
- CORS middleware
- dotenv for environment variables

## 📁 Project Structure

```
KIRETY_KSVID_CHAT/
├── CHAT/                          # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── assets/               # Images and static files
│   │   ├── components/           # Reusable React components
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── Contacts.jsx
│   │   │   ├── Logout.jsx
│   │   │   └── Message.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Chat.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SetAvatar.jsx
│   │   ├── utils/               # Utility functions
│   │   │   └── APIRoutes.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── server/                       # Backend (Node.js)
    ├── controllers/              # Route controllers
    │   ├── messagesController.js
    │   └── userController.js
    ├── model/                   # Database models
    │   ├── messageModel.js
    │   └── userModel.js
    ├── routes/                  # API routes
    │   ├── messagesRoutes.js
    │   └── userRoutes.js
    ├── index.js                 # Server entry point
    └── package.json
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kiretychowdary/KIRETY_KSVID_CHAT.git
   cd KIRETY_KSVID_CHAT/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URL=your_mongodb_connection_string
   PORT=5000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../CHAT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API configuration**
   In `src/utils/APIRoutes.js`, update the host URL:
   ```javascript
   // For local development
   export const host = "http://localhost:5000";
   
   // For production
   export const host = "https://your-deployed-backend-url.com";
   ```

4. **Start the frontend**
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/setAvatar/:id` - Set user avatar
- `GET /api/auth/allusers/:id` - Get all users except current user

### Message Routes
- `POST /api/messages/addmsg` - Send new message
- `POST /api/messages/getmsg` - Get messages between two users

## 🔧 Configuration

### Environment Variables
- `MONGODB_URL` - MongoDB connection string
- `PORT` - Server port (default: 5000)

### CORS Configuration
The server is configured to accept requests from:
- `https://nmkrspvlidata.netlify.app` (production)
- `http://localhost:5173` (development)

## 📱 Features Overview

### User Authentication
- Secure user registration and login
- Password hashing with bcrypt
- Input validation and error handling

### Real-time Chat
- Instant messaging with Socket.io
- Online user tracking
- Message history persistence

### Avatar System
- Optional user avatar selection
- Multiavatar integration for default avatars
- Avatar can be skipped (users go directly to chat)

### Responsive Design
- Mobile-first approach
- Professional UI with smooth animations
- Toast notifications for user feedback

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Create a new service on your hosting platform
2. Connect your GitHub repository
3. Set environment variables
4. Deploy the `server` directory

### Frontend Deployment (Netlify/Vercel)
1. Create a new site from your repository
2. Set build directory to `CHAT`
3. Update API routes to point to deployed backend
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add proper documentation
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Kirety**
- GitHub: [@Kiretychowdary](https://github.com/Kiretychowdary)

## 🔗 Live Demo

- **Frontend**: [https://nmkrspvlidata.netlify.app](https://nmkrspvlidata.netlify.app)
- **Backend**: [https://kirety-ksvid-chat.onrender.com](https://kirety-ksvid-chat.onrender.com)

---

## 📋 Development Notes

### Code Quality
- Clean, readable code with proper comments
- Consistent naming conventions
- Error handling and validation
- Professional file structure

### Security Features
- Password hashing with salt rounds
- Input validation and sanitization
- CORS protection
- Environment variable security

### Performance Optimizations
- Database indexing for better query performance
- Efficient Socket.io event handling
- Optimized frontend bundle with Vite
- Proper error boundaries and loading states

---

**Built with ❤️ by Kirety for the KSVID Chat community**
