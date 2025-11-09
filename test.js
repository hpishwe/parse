const { parseDocxToCSV } = require('./docxParser');
const path = require('path');

async function testParsing() {
  try {
    const docxPath = path.join(__dirname, 'BGV Consent Form.doc');
    const csvPath = path.join(__dirname, 'output.csv');
    
    console.log('🚀 Starting test...');
    console.log('📄 Input file:', docxPath);
    
    const result = await parseDocxToCSV(docxPath, csvPath);
    
    console.log('✅ Success!');
    console.log('📊 Records parsed:', result.length);
    console.log('💾 CSV saved to:', csvPath);
    console.log('\nSample data:', result[0]);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testParsing();
