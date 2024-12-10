const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'backend/uploads/' });

app.use(express.static('frontend'));

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' });
    }

    try {
        const filePath = req.file.path;
        const pythonAPIUrl = 'http://localhost:5000/process';

        // Forward the file to the Python API
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        const response = await axios.post(pythonAPIUrl, formData, {
            headers: { ...formData.getHeaders() },
        });

        // Move processed file to the "processed" folder
        const processedFilePath = path.join('backend/processed/', response.data.output_filename);
        fs.renameSync(filePath, processedFilePath);

        res.send({
            message: 'File processed successfully',
            data: response.data,
            outputFile: processedFilePath,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Error processing the file' });
    }
});

// Start the Express server
app.listen(3000, () => {
    console.log('Express server is running on http://localhost:3000');
});
