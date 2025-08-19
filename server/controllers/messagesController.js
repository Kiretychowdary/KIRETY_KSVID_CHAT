/**
 * Messages Controller - Handles chat message operations
 * KSVID Chat Application
 * Author: Kirety
 */

const Message = require("../model/messageModel");

/**
 * Add a new message to the database
 */
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    
    // Validate input
    if (!from || !to || !message) {
      return res.status(400).json({ 
        success: false,
        message: "From, to, and message fields are required" 
      });
    }

    // Create new message
    const newMessage = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from
    });

    if (newMessage) {
      console.log(`📤 Message sent from ${from} to ${to}`);
      res.status(201).json({ 
        success: true,
        message: "Message sent successfully",
        data: newMessage
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: "Failed to send message" 
      });
    }

  } catch (error) {
    console.error("Add message error:", error);
    next(error);
  }
};

/**
 * Get all messages between two users
 */
module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    
    // Validate input
    if (!from || !to) {
      return res.status(400).json({ 
        success: false,
        message: "From and to user IDs are required" 
      });
    }

    // Find all messages between the two users
    const messages = await Message.find({
      users: {
        $all: [from, to],
      }
    }).sort({ updatedAt: 1 });

    // Project messages to include only necessary fields
    const projectedMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
      timestamp: msg.createdAt
    }));

    console.log(`📋 Retrieved ${projectedMessages.length} messages between ${from} and ${to}`);

    res.json({
      success: true,
      data: projectedMessages
    });

  } catch (error) {
    console.error("Get messages error:", error);
    next(error);
  }
};