/**
 * API Routes Configuration
 * KSVID Chat Application
 * Author: Kirety
 */

// Base server URL - change this based on your environment
export const host = "https://kirety-ksvid-chat.onrender.com";
// For local development, uncomment the line below:
// export const host = "http://localhost:5000";

// Authentication routes
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/setAvatar`;
export const allUsersRoute = `${host}/api/auth/allusers`;

// Message routes
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const getMessagesRoute = `${host}/api/messages/getmsg`;
