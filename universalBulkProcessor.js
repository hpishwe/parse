require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { extractTextFromFile } = require('./universalParser');
const { Candidate } = require('./bgvSchema');

// Parse extracted text into candidate data
function parseTextToCandidate(text, filename) {
  const candidate = {
    candidateId: new mongoose.Types.ObjectId().toString(),
    firstName: '',
    middleName: '',
    surname: '',
    dateOfBirth: '',
    nationalId: '',
    homePhone: '',
    status: 'pending',
    sourceFile: filename
  };
  
  // Extract name
  const nameMatch = text.match(/Name of Applicant[:\s]+([^\n]+)/i);
  if (nameMatch) {
    const parts = nameMatch[1].trim().split(/\s+/);
    candidate.surname = parts[0] || '';
    candidate.middleName = parts[1] || '';
    candidate.firstName = parts[2] || '';
  }
  
  // Extract DOB
  const dobMatch = text.match(/Date of Birth[^:]*:\s*([^\n]+)/i);
  if (dobMatch) candidate.dateOfBirth = dobMatch[1].trim();
  
  // Extract National ID
  const idMatch = text.match(/National ID[:\s]+([^\n]+)/i);
  if (idMatch) candidate.nationalId = idMatch[1].trim();
  
  // Extract Phone
  const phoneMatch = text.match(/Home Phone[:\s]+([^\n]+)/i);
  if (phoneMatch) candidate.homePhone = phoneMatch[1].trim();
  
  // Add more parsing logic as needed
  
  return candidate;
}

async function processBulkFiles(folderPath) {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas\n');
  
  // Get all supported files
  const files = fs.readdirSync(folderPath);
  const supportedFiles = files.filter(f => 
    /\.(pdf|docx|doc)$/i.test(f)
  );
  
  console.log(`📦 Found ${supportedFiles.length} files to process\n`);
  
  const results = {
    pdf: { success: 0, failed: 0 },
    docx: { success: 0, failed: 0 },
    doc: { success: 0, failed: 0 }
  };
  
  // Process in batches of 10
  const batchSize = 10;
  
  for (let i = 0; i < supportedFiles.length; i += batchSize) {
    const batch = supportedFiles.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (file, index) => {
      const ext = path.extname(file).toLowerCase().substring(1);
      const filePath = path.join(folderPath, file);
      const fileNum = i + index + 1;
      
      try {
        console.log(`[${fileNum}/${supportedFiles.length}] Processing (${ext}): ${file}`);
        
        // Extract text (works for PDF, DOCX, DOC)
        const text = await extractTextFromFile(filePath);
        
        // Parse text into candidate data
        const candidateData = parseTextToCandidate(text, file);
        
        // Save to MongoDB
        const candidate = new Candidate(candidateData);
        await candidate.save();
        
        results[ext].success++;
        console.log(`✅ Success: ${file}\n`);
        
      } catch (error) {
        results[ext].failed++;
        console.error(`❌ Failed: ${file} - ${error.message}\n`);
      }
    }));
  }
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 PROCESSING SUMMARY');
  console.log('='.repeat(50));
  console.log(`PDF:  ${results.pdf.success} ✅  ${results.pdf.failed} ❌`);
  console.log(`DOCX: ${results.docx.success} ✅  ${results.docx.failed} ❌`);
  console.log(`DOC:  ${results.doc.success} ✅  ${results.doc.failed} ❌`);
  console.log(`Total Success: ${results.pdf.success + results.docx.success + results.doc.success}`);
  console.log(`Total Failed:  ${results.pdf.failed + results.docx.failed + results.doc.failed}`);
  console.log('='.repeat(50));
  
  await mongoose.connection.close();
}

// Usage
const formsFolder = './bulk-forms';
processBulkFiles(formsFolder)
  .then(() => console.log('\n✅ Bulk processing complete!'))
  .catch(err => console.error('❌ Error:', err));
