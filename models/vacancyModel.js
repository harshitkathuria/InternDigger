const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({

  jobID: {
    type: Number, 
    unique: [true, 'Please try a different jobID'],
    required: [true, 'Please enter the Job ID'] 
  },
  position: {
    type: String, 
    required: [true, 'Please enter a position to apply for']
  },
  type: {
    type: String,
    required: [true, 'A vacancy must have a Job Type'],
    enum: {
      values: ['Part Time', 'Full Time'],
      message: 'A vacancy must have a Job type of Part Time or Full Time'
    }
  },
  postedOn: {
    type: Date,
    default: Date.now()
  },
  stipend: {
    type: Number,
    required: [true, 'A vacancy must have a stipend']
  },
  lastDate: {
    type: String,
    required: [true, 'A vacancy must have a last Date']
  },
  contactEmail: {
    type: String,
    required: [true, 'A vacancy must have a contact email']
  },
  city: {
    type: String,
    required: [true, 'A string must have a city']
  },
  summary: {
    type: String,
    required: [true, 'Please enter the summary']
  },
  description: {
    type: String,
    required: [true, 'Please enter the description']
  },
  organization: {
    type: String,
    required: [true, 'Please enter the organization']
  },
  duration: {
    type: String, 
    required: [true, 'Please enter the duration']
  }
});

const Vacancy = mongoose.model('Vacancy', vacancySchema);

module.exports = Vacancy;