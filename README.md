

### Step 1: Clone and Install

```
# Clone the repository
git clone https://github.com/hpishwe/parse.git

# Navigate to project directory
cd parse

# Install dependencies
npm install

# Create uploads folder
mkdir uploads
```

### Step 2: Prepare Your BGV Form

1. Open your BGV Consent Form in Microsoft Word
2. Fill in sample candidate data (or use a filled form)
3. **Important:** Save as `.docx` format (not `.doc`)
   - File → Save As → Choose "Word Document (.docx)"

### Step 3: Test the Parser

```
# Run the test script
node testBGV.js
```

**Expected Output:**
```
🚀 Testing BGV form parsing...
📄 Reading BGV form from: D:\parse\parse\BGV Consent Form.docx
✅ Text extracted, parsing form data...
📊 Parsed candidate data
✅ CSV created successfully at: D:\parse\parse\bgv-output.csv
```

**Check Results:**
- Open `bgv-output.csv` to see extracted data
- Verify candidate information was parsed correctly

### Step 4: Run the Server (Optional)

```
# Start the Express server
node server.js
```

**Server starts at:** `http://localhost:3000`

### Step 5: Test API with Postman

1. Open Postman
2. Create new request:
   - **Method:** POST
   - **URL:** `http://localhost:3000/api/upload-docx`
3. Configure request:
   - Go to **Body** tab
   - Select **form-data**
   - Add key: `docx` (change type to **File**)
   - Select your filled BGV form (.docx)
4. Click **Send**

**Expected Response:**
```
{
  "message": "File processed successfully",
  "candidatesProcessed": 1,
  "csvFile": "./uploads/1699523400000-candidates.csv",
  "data": [...]
}
```

### Step 6: Verify Output

```
# Check CSV was created
ls uploads/

# View CSV content
cat uploads/*.csv
```

## ✅ You're All Set!

The project is now running and ready to parse BGV forms. Upload additional forms via the API or run `testBGV.js` with different files.

## 🐛 Troubleshooting

**Issue:** `Error: Could not find the body element`
- **Solution:** Your file is in `.doc` format. Convert to `.docx`

**Issue:** `Cannot find module 'mammoth'`
- **Solution:** Run `npm install`

**Issue:** All fields show labels instead of data
- **Solution:** Your form is blank. Fill it with actual candidate data

**Issue:** `ENOENT: no such file or directory`
- **Solution:** Create the `uploads` folder: `mkdir uploads`
```
