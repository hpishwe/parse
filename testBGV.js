const { parseBGVFormToCSV } = require('./bgvParser');
const path = require('path');

async function testBGVParsing() {
  try {
    const docxPath = path.join(__dirname, 'BGV Consent Form.docx');
    const csvPath = path.join(__dirname, 'bgv-output.csv');
    
    console.log('🚀 Testing BGV form parsing...\n');
    
    const result = await parseBGVFormToCSV(docxPath, csvPath);
    
    console.log('\n✅ Parsing complete!');
    console.log('📊 Candidate data:', JSON.stringify(result[0], null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBGVParsing();
