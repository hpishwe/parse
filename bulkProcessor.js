const fs = require('fs');
const path = require('path');
const { parseBGVFormToCSV } = require('./bgvParser');
const { Candidate } = require('./bgvSchema');
const mongoose = require('mongoose');

async function processBulkForms(folderPath) {
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.docx'));
  
  console.log(`📦 Found ${files.length} DOCX files to process`);
  
  const results = {
    success: [],
    failed: []
  };
  
  // Process in batches of 10 for better performance
  const batchSize = 10;
  
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (file, index) => {
      try {
        const docxPath = path.join(folderPath, file);
        const csvPath = path.join(folderPath, `${file}-output.csv`);
        
        console.log(`⏳ Processing [${i + index + 1}/${files.length}]: ${file}`);
        
        // Parse DOCX
        const parsedData = await parseBGVFormToCSV(docxPath, csvPath);
        
        // Save to MongoDB
        const candidate = new Candidate({
          candidateId: new mongoose.Types.ObjectId().toString(),
          ...parsedData[0]
        });
        
        await candidate.save();
        
        results.success.push(file);
        console.log(`✅ Success: ${file}`);
        
      } catch (error) {
        console.error(`❌ Failed: ${file} - ${error.message}`);
        results.failed.push({ file, error: error.message });
      }
    }));
  }
  
  return results;
}

module.exports = { processBulkForms };
