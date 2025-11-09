const express = require('express');
const multer = require('multer');
const path = require('path');
const { parseDocxToCSV } = require('./docxParser');
const { bulkUploadCSV } = require('./bulkUpload');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) === '.docx') {
      cb(null, true);
    } else {
      cb(new Error('Only .docx files allowed'));
    }
  }
});

// Upload and process route
router.post('/upload-docx', upload.single('docx'), async (req, res) => {
  try {
    const docxPath = req.file.path;
    const csvPath = `./uploads/${Date.now()}-candidates.csv`;
    
    // Step 1: Parse DOCX to CSV
    await parseDocxToCSV(docxPath, csvPath);
    
    // Step 2: Bulk upload CSV to MongoDB
    const result = await bulkUploadCSV(csvPath);
    
    res.status(200).json({
      message: 'File processed and uploaded successfully',
      candidatesAdded: result.length
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Processing failed',
      error: error.message
    });
  }
});

module.exports = router;
