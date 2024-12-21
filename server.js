const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // To allow requests from React app
const fileRoutes = require('./src/routes/fileRoutes');
const authRoutes = require('./src/routes/authRoutes');  // Fixed typo
const sequelize = require('./src/models/db'); // Import the Sequelize instance

const app = express();

// Enable CORS for requests from the frontend
app.use(cors());
app.use(express.json()); // For parsing JSON bodies

app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'guga-blog/build')));  // Check if this path is correct

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory for saving files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save files with their original names
  },
});

const upload = multer({ storage });

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  res.status(200).json({
    message: `File "${req.file.originalname}" uploaded successfully.`,
  });
});

// Fetch the list of uploaded files
app.get('/file-list', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return res.status(500).json({ error: 'Failed to retrieve file list.' });
    }
    res.status(200).json(files);
  });
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../guga-blog/build', 'index.html'));
});

// Sync the database (create tables if they don't exist)
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully!');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
