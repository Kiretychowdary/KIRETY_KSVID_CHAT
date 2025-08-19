/**
 * User Controller - Handles user authentication and management
 * KSVID Chat Application
 * Author: Kirety
 */

const User = require("../model/userModel");
const bcrypt = require("bcrypt");

/**
 * Register a new user
 */
module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            email,
            username,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        console.log(`✅ New user registered: ${savedUser.username}`);

        // Remove password from response
        const userResponse = {
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            isAvatarImageSet: savedUser.isAvatarImageSet,
            avatarImage: savedUser.avatarImage
        };

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: userResponse
        });

    } catch (error) {
        console.error("Registration error:", error);
        next(error);
    }
};

/**
 * Login user
 */
module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        console.log(`✅ User logged in: ${user.username}`);

        // Remove password from response
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            isAvatarImageSet: user.isAvatarImageSet,
            avatarImage: user.avatarImage
        };

        res.status(200).json({
            success: true,
            message: "Login successful",
            user_data: userResponse
        });

    } catch (error) {
        console.error("Login error:", error);
        next(error);
    }
};

/**
 * Set user avatar
 */
module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Avatar image is required"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarImage: image,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log(`✅ Avatar set for user: ${updatedUser.username}`);

        res.json({
            success: true,
            isSet: updatedUser.isAvatarImageSet,
            image: updatedUser.avatarImage
        });

    } catch (error) {
        console.error("Set avatar error:", error);
        next(error);
    }
};

/**
 * Get all users except the current user
 */
module.exports.getAllUsers = async (req, res, next) => {
    try {
        const currentUserId = req.params.id;

        // Get all users except current user, excluding password field
        const users = await User.find({ _id: { $ne: currentUserId } })
            .select("email username avatarImage _id isAvatarImageSet");

        console.log(`📋 Retrieved ${users.length} users for user ${currentUserId}`);

        res.json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });

    } catch (error) {
        console.error("Get all users error:", error);
        next(error);
    }
};
