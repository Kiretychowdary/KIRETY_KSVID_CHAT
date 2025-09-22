const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "dpcy3d46l",
  api_key: "559299431159228",
  api_secret: "UuUIrR9Jj90-2xx8X4LzntasM6Y",
});

module.exports = cloudinary;