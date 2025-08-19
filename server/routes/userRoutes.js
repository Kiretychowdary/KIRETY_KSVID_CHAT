/**
 * User Routes - Handles user-related API endpoints
 * KSVID Chat Application
 * Author: Kirety
 */

const router = require("express").Router();
const { 
  register, 
  login, 
  setAvatar, 
  getAllUsers 
} = require("../controllers/userController");

// User authentication routes
router.post("/register", register);
router.post("/login", login);

// User management routes
router.post("/setAvatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);

module.exports = router;  