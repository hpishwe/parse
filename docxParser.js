const mammoth = require('mammoth');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

async function parseDocxToCSV(docxPath, csvPath) {
  try {
    // Extract raw text from DOCX
    const result = await mammoth.extractRawText({ path: docxPath });
    const text = result.value; // Raw text extracted
    
    // Split into lines and parse (adjust based on your document structure)
    const lines = text.split('\n').filter(line => line.trim());
    
    // Parse data - customize this based on your DOCX structure
    const candidateData = [];
    
    // Example: if your DOCX has format like "Name: John\nAddress: 123 Street"
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Name:')) {
        candidateData.push({
          name: lines[i].split(':')[1].trim(),
          extractedAddress: lines[i + 1]?.split(':')[1]?.trim() || '',
          status: 'pending'
        });
      }
    }
    
    // Write to CSV
    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'name', title: 'Name' },
        { id: 'extractedAddress', title: 'Address' },
        { id: 'status', title: 'Status' }
      ]
    });
    
    await csvWriter.writeRecords(candidateData);
    console.log('CSV created successfully');
    return candidateData;
    
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw error;
  }
}

module.exports = { parseDocxToCSV };
