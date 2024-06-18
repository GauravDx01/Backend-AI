const mongoose = require('mongoose');

const fileDataSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    ipAddress: {
        type: String,
      
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    paragraphs: {
        type: String,
       
    },
    filePath: { type: String, required: true }, // Add filePath field
});

const FileData = mongoose.model('FileData', fileDataSchema);

module.exports = FileData;
 