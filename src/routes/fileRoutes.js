// routes/fileRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage with the correct path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save to the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save file with its original name
  }
});

const upload = multer({ storage });

// Endpoint to upload files
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.send(`File ${req.file.originalname} uploaded successfully.`);
});

// Endpoint to get a list of uploaded files
router.get('/file-list', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error reading upload directory:', err);
      return res.status(500).json({ error: 'Unable to fetch file list' });
    }
    res.json(files); // Send the list of files
  });
});

// Serve the uploaded files statically
router.use('/uploads', express.static(uploadDir));

module.exports = router;