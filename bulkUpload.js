const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');

// Define Candidate Schema
const candidateSchema = new mongoose.Schema({
  candidateId: { type: String, unique: true },
  name: String,
  extractedAddress: String,
  providedCoordinates: {
    lat: Number,
    lng: Number
  },
  status: { type: String, default: 'pending' }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

async function bulkUploadCSV(csvPath) {
  const candidates = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        candidates.push({
          candidateId: new mongoose.Types.ObjectId().toString(),
          name: row.Name,
          extractedAddress: row.Address,
          status: row.Status || 'pending'
        });
      })
      .on('end', async () => {
        try {
          // Bulk insert into MongoDB
          const result = await Candidate.insertMany(candidates, { 
            ordered: false // Continue on duplicate key errors
          });
          console.log(`${result.length} candidates uploaded successfully`);
          resolve(result);
        } catch (error) {
          console.error('Bulk upload error:', error);
          reject(error);
        }
      })
      .on('error', reject);
  });
}

module.exports = { bulkUploadCSV, Candidate };
