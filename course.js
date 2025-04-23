// models/Course.js
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., B.Tech, Pharmacy
  duration: { type: Number, required: true }, // e.g., 4 for B.Tech
  department: { type: String } // optional: like Engineering, Medical, etc.
});

module.exports = mongoose.model("Course", CourseSchema);
