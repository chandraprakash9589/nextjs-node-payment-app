const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    instructorBio: { type: String },
    price: { type: Number, required: true }, // in INR
    thumbnail: { type: String },
    category: { type: String },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    duration: { type: String },
    lessons: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    students: { type: Number, default: 0 },
    tags: [String],
    whatYouLearn: [String],   // bullet points shown on detail page
    requirements: [String],   // prerequisites
    curriculum: [            // course sections
      {
        section: String,
        lectures: [String],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
