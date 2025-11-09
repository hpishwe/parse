const mammoth = require('mammoth');
const { createObjectCsvWriter } = require('csv-writer');

async function parseBGVFormToCSV(docxPath, csvPath) {
  try {
    console.log('📄 Reading BGV form from:', docxPath);
    
    // Extract raw text
    const result = await mammoth.extractRawText({ path: docxPath });
    const text = result.value;
    
    console.log('✅ Text extracted, parsing form data...');
    
    // Initialize data object
    const candidate = {
      // Personal Details
      surname: '',
      middleName: '',
      firstName: '',
      dateOfBirth: '',
      sex: '',
      fatherName: '',
      nationalId: '',
      homePhone: '',
      
      // Permanent Address
      permanentAddress: '',
      permanentLandmark: '',
      permanentCity: '',
      permanentDurationFrom: '',
      permanentDurationTo: '',
      
      // Current Address
      currentAddress: '',
      currentLandmark: '',
      currentCity: '',
      currentDurationFrom: '',
      currentDurationTo: '',
      
      // Education
      tenth: '',
      twelfth: '',
      graduationDegree: '',
      graduationDiscipline: '',
      postGradDegree: '',
      postGradDiscipline: '',
      
      // Employment (Most recent)
      employer1Name: '',
      employer1Address: '',
      employer1City: '',
      employer1JobTitle: '',
      employer1From: '',
      employer1To: '',
      employer1EmployeeId: '',
      employer1Phone: '',
      employer1Salary: '',
      
      // Employment 2
      employer2Name: '',
      employer2JobTitle: '',
      employer2From: '',
      employer2To: '',
      
      // References
      reference1: '',
      reference2: '',
      
      status: 'pending'
    };
    
    // Parse the text (adjust regex patterns based on actual filled form)
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    // Extract name fields
    const nameMatch = text.match(/Name of Applicant:\s*([^\n]+)/i);
    if (nameMatch) {
      const nameParts = nameMatch[1].trim().split(/\s+/);
      candidate.surname = nameParts[0] || '';
      candidate.middleName = nameParts[1] || '';
      candidate.firstName = nameParts[2] || '';
    }
    
    // Extract DOB
    const dobMatch = text.match(/Date of Birth[^:]*:\s*([^\n]+)/i);
    if (dobMatch) candidate.dateOfBirth = dobMatch[1].trim();
    
    // Extract Sex
    const sexMatch = text.match(/Sex:\s*([^\n]+)/i);
    if (sexMatch) candidate.sex = sexMatch[1].trim();
    
    // Extract Father's Name
    const fatherMatch = text.match(/Father's Name:\s*([^\n]+)/i);
    if (fatherMatch) candidate.fatherName = fatherMatch[1].trim();
    
    // Extract National ID
    const idMatch = text.match(/National ID:\s*([^\n]+)/i);
    if (idMatch) candidate.nationalId = idMatch[1].trim();
    
    // Extract Phone
    const phoneMatch = text.match(/Home Phone:\s*([^\n]+)/i);
    if (phoneMatch) candidate.homePhone = phoneMatch[1].trim();
    
    // Extract Permanent Address
    const permAddressMatch = text.match(/PERMANENT ADDRESS:\s*([^\n]+)/i);
    if (permAddressMatch) candidate.permanentAddress = permAddressMatch[1].trim();
    
    // Extract Current Address
    const currAddressMatch = text.match(/CURRENT ADDRESS:\s*([^\n]+)/i);
    if (currAddressMatch) candidate.currentAddress = currAddressMatch[1].trim();
    
    // Extract Employer 1 details
    const emp1NameMatch = text.match(/EMPLOYER 1[^:]*Company Name:\s*-?\s*([^\n]+)/i);
    if (emp1NameMatch) candidate.employer1Name = emp1NameMatch[1].trim();
    
    const emp1JobMatch = text.match(/Job Title:\s*([^\n]+)/i);
    if (emp1JobMatch) candidate.employer1JobTitle = emp1JobMatch[1].trim();
    
    // Extract references
    const refMatches = text.match(/Professional References[\s\S]*?Name[\s\S]*?1\.\s*([^\n]+)[\s\S]*?2\.\s*([^\n]+)/i);
    if (refMatches) {
      candidate.reference1 = refMatches[1].trim();
      candidate.reference2 = refMatches[2].trim();
    }
    
    console.log('📊 Parsed candidate data');
    
    // Write to CSV
    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'firstName', title: 'First Name' },
        { id: 'middleName', title: 'Middle Name' },
        { id: 'surname', title: 'Surname' },
        { id: 'dateOfBirth', title: 'Date of Birth' },
        { id: 'sex', title: 'Sex' },
        { id: 'fatherName', title: 'Father Name' },
        { id: 'nationalId', title: 'National ID' },
        { id: 'homePhone', title: 'Home Phone' },
        { id: 'permanentAddress', title: 'Permanent Address' },
        { id: 'permanentCity', title: 'Permanent City' },
        { id: 'currentAddress', title: 'Current Address' },
        { id: 'currentCity', title: 'Current City' },
        { id: 'tenth', title: '10th' },
        { id: 'twelfth', title: '12th' },
        { id: 'graduationDegree', title: 'Graduation Degree' },
        { id: 'graduationDiscipline', title: 'Graduation Discipline' },
        { id: 'employer1Name', title: 'Current Employer' },
        { id: 'employer1JobTitle', title: 'Current Job Title' },
        { id: 'employer1From', title: 'Employment From' },
        { id: 'employer1To', title: 'Employment To' },
        { id: 'reference1', title: 'Reference 1' },
        { id: 'reference2', title: 'Reference 2' },
        { id: 'status', title: 'Status' }
      ]
    });
    
    await csvWriter.writeRecords([candidate]);
    console.log('✅ CSV created successfully at:', csvPath);
    
    return [candidate];
    
  } catch (error) {
    console.error('❌ Error parsing BGV form:', error);
    throw error;
  }
}

module.exports = { parseBGVFormToCSV };
