const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  // Personal Details
  candidateId: { type: String, unique: true },
  firstName: String,
  middleName: String,
  surname: String,
  dateOfBirth: String,
  sex: String,
  fatherName: String,
  nationalId: String,
  homePhone: String,
  
  // Addresses
  permanentAddress: {
    address: String,
    landmark: String,
    city: String,
    durationFrom: String,
    durationTo: String
  },
  currentAddress: {
    address: String,
    landmark: String,
    city: String,
    durationFrom: String,
    durationTo: String
  },
  
  // For your geocoding feature
  extractedAddress: String,
  providedCoordinates: {
    lat: Number,
    lng: Number
  },
  
  // Education
  education: {
    tenth: String,
    twelfth: String,
    graduation: {
      degree: String,
      discipline: String
    },
    postGraduation: {
      degree: String,
      discipline: String
    }
  },
  
  // Employment History
  employmentHistory: [{
    companyName: String,
    jobTitle: String,
    from: String,
    to: String,
    employeeId: String,
    address: String,
    city: String,
    salary: String
  }],
  
  // References
  references: [{
    name: String,
    contact: String
  }],
  
  status: { type: String, default: 'pending' },
  verificationLink: String,
  createdAt: { type: Date, default: Date.now }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = { Candidate };
