const mongoose = require('mongoose');
const ChapterSchema = mongoose.Schema(
    {


        serialNumber: {
            type: Number,
            default: 0
        },


        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true,
        },

        chapterName: {
            type: String,

        },

        pdfUrl: {
            type: String,

        },

        dictionaryUrl: {
            type: String,

        },
    },
    {
        timestamps: true,
        collection: 'Chapter',
    }
);
const Chapter = mongoose.model('Chapter', ChapterSchema);
module.exports = Chapter;