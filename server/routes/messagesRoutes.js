/**
 * Message Routes - Handles message-related API endpoints
 * KSVID Chat Application
 * Author: Kirety
 */

const router = require("express").Router();
const { 
  addMessage, 
  getAllMessage 
} = require("../controllers/messagesController");

// Message routes
router.post("/addmsg", addMessage);
router.post("/getmsg", getAllMessage);

module.exports = router;  