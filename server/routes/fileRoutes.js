const router = require("express").Router();
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configure storage for temporary files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route to upload file to Cloudinary
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get file extension
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    
    // Determine resource_type based on file extension
    let resourceType = "auto";
    if (/^(mp4|mov|avi|wmv|flv|mkv|webm)$/i.test(fileExtension)) {
      resourceType = "video";
    } else if (/^(mp3|wav|ogg|m4a|flac)$/i.test(fileExtension)) {
      resourceType = "audio";
    } else if (/^(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileExtension)) {
      resourceType = "image";
    } else if (/^(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv)$/i.test(fileExtension)) {
      resourceType = "raw";
    } else {
      resourceType = "auto";
    }
    
    // Upload file to cloudinary with the appropriate resource_type
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: resourceType,
    });

    // Delete temporary file
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: result.secure_url,
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ message: "Error uploading file", error: error.message });
  }
});

module.exports = router;