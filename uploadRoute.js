const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const { parseBGVFormToCSV } = require('./bgvParser');
const { Candidate } = require('./bgvSchema');

const router = express.Router();

// Multer setup (same as before)
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.docx') {
      cb(null, true);
    } else {
      cb(new Error('Only .docx files allowed'));
    }
  }
});

// Upload and save to MongoDB
router.post('/upload-docx', upload.single('docx'), async (req, res) => {
  try {
    const docxPath = req.file.path;
    const csvPath = `./uploads/${Date.now()}-candidates.csv`;
    
    // Parse DOCX
    const parsedData = await parseBGVFormToCSV(docxPath, csvPath);
    
    // Save to MongoDB
    const candidate = new Candidate({
      candidateId: new mongoose.Types.ObjectId().toString(),
      firstName: parsedData[0].firstName,
      middleName: parsedData[0].middleName,
      surname: parsedData[0].surname,
      dateOfBirth: parsedData[0].dateOfBirth,
      nationalId: parsedData[0].nationalId,
      homePhone: parsedData[0].homePhone,
      permanentAddress: {
        address: parsedData[0].permanentAddress,
        city: parsedData[0].permanentCity
      },
      currentAddress: {
        address: parsedData[0].currentAddress,
        city: parsedData[0].currentCity
      },
      status: 'pending'
    });
    
    const savedCandidate = await candidate.save();
    
    res.status(200).json({
      message: 'Candidate saved to MongoDB successfully!',
      candidateId: savedCandidate._id,
      data: savedCandidate
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Failed to process',
      error: error.message
    });
  }
});

module.exports = router;
