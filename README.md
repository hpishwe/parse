

#### Step 1: Put Forms in a Folder

Create a folder and add all your BGV forms:

my-forms/
├── candidate-001.pdf
├── john-doe-application.docx
├── jane-smith-form.doc
├── resume_2023.pdf
text

#### Step 2: Run Bulk Processor

node bulkProcessor.js ./my-forms

text

Replace `./my-forms` with your folder path.

#### Step 3: Check Results
You'll see progress for each file:

✅ Connected to MongoDB

📦 Found 150 files to process

[1/150] Processing: candidate-001.pdf
✅ Success

[2/150] Processing: john-doe-application.docx
✅ Success

...

==================================================
📊 PROCESSING COMPLETE
✅ Success: 148
❌ Failed: 2

text

---

### Option 3: API Upload (For Developers)

**Upload via REST API using Postman or code**

**Endpoint:** `POST http://localhost:3000/api/upload-docx`

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: 
  - Key: `docx` (type: File)
  - Value: Your BGV form file

**Response:**
{
"message": "Candidate saved to MongoDB successfully!",
"candidateId": "673a8b5c9d1e2f3a4b5c6d7e",
"data": { ... }
}

text

**Using cURL:**
curl -X POST http://localhost:3000/api/upload-docx
-F "docx=@/path/to/your/form.pdf"

text

## 📁 Project Structure

parse/
├── .env # Environment variables (MongoDB URI)
├── .gitignore # Git ignore rules
├── package.json # Dependencies
├── README.md # This file
│
├── server.js # Main server entry point
├── bgvSchema.js # MongoDB candidate schema
├── uploadRoute.js # API routes
├── universalParser.js # Handles PDF/DOCX/DOC parsing
├── bulkProcessor.js # Bulk file processing
│
├── testBGV.js # Test single file
├── BGV Consent Form.docx # Sample form
│
├── public/
│ └── index.html # Web upload interface
│
├── node_modules/ # Dependencies (auto-generated)
├── uploads/ # Single file uploads (auto-created)
└── bulk-forms/ # Put bulk files here

text

## 🎯 Quick Commands Cheatsheet

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start server | `npm start` |
| Test single file | `node testBGV.js` |
| Bulk process (default folder) | `node bulkProcessor.js` |
| Bulk process (custom folder) | `node bulkProcessor.js ./your-folder` |
| Check MongoDB connection | See server logs after `npm start` |

## 📊 View Parsed Data

### In MongoDB Atlas:

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Click **"Browse Collections"**
3. Select database: `hr-verification`
4. Select collection: `candidates`
5. View all parsed candidate records! 🎉

### Data Schema:

Each candidate document contains:
- Personal info (name, DOB, ID)
- Contact details (phone, email)
- Addresses (permanent, current)
- Education history
- Employment history
- Status (pending/verified)
- Source filename
