const mongoose = require('mongoose');

const courseBundleSchema = new mongoose.Schema({
    year: {
        type: String, // "1st", "2nd", "3rd", "4th"
        required: true
    },
    courseType: {
        type: String, // "Challenge", "Detailed"
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: "Get access to all subjects in this course category."
    },
    discount: {
        type: String,
        default: ""
    },
    promoTag: {
        type: String,
        default: ""
    }
}, { timestamps: true });

// Ensure unique price per year + courseType
courseBundleSchema.index({ year: 1, courseType: 1 }, { unique: true });

module.exports = mongoose.model('CourseBundle', courseBundleSchema);
