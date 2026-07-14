const mongoose = require('mongoose');

const ChapterVideoSchema = mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'ChapterVideo',
  }
);

const ChapterVideo = mongoose.model('ChapterVideo', ChapterVideoSchema);
module.exports = ChapterVideo;
