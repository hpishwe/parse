const mammoth = require('mammoth');
const officeParser = require('officeparser');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

/**
 * Universal parser - handles PDF, DOCX, and DOC files
 */
async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  try {
    switch (ext) {
      case '.docx':
        return await extractFromDocx(filePath);
      
      case '.doc':
        return await extractFromDoc(filePath);
      
      case '.pdf':
        return await extractFromPdf(filePath);
      
      default:
        throw new Error(`Unsupported file format: ${ext}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    throw error;
  }
}

// Extract from DOCX (modern Word format)
async function extractFromDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

// Extract from DOC (old Word format)
async function extractFromDoc(filePath) {
  const text = await officeParser.parseOfficeAsync(filePath);
  return text;
}

// Extract from PDF
async function extractFromPdf(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

module.exports = { extractTextFromFile };
