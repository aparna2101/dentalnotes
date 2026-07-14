const mongoose = require('mongoose');

const demoVideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    courseType: {
        type: String, // "Challenge" or "Detailed"
        required: true
    },
    year: {
        type: String, // "1st", "2nd", "3rd", "4th"
        required: true
    },
    serialNumber: {
        type: Number,
        default: 0
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }
}, { timestamps: true });

module.exports = mongoose.model('DemoVideo', demoVideoSchema);
