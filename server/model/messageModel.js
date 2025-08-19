/**
 * Message Model - Defines the message schema for MongoDB
 * KSVID Chat Application
 * Author: Kirety
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: {
    text: { 
      type: String, 
      required: [true, 'Message text is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    }
  },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    validate: {
      validator: function(v) {
        return v.length === 2;
      },
      message: 'Users array must contain exactly 2 user IDs'
    }
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: [true, 'Sender is required'],
    ref: "User" 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for better query performance
messageSchema.index({ users: 1, createdAt: 1 });
messageSchema.index({ sender: 1 });

module.exports = mongoose.model('Message', messageSchema);
