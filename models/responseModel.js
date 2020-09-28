const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  vacancy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vacancy',
    required: [true, 'A response must have a vacancy'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A response must have an user']
  },
  appliedAt: {
    type: Date,
    default: Date.now()
  }
})

responseSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'vacancy',
    select: 'jobID position contactEmail organization'
  });
  this.populate({
    path: 'user',
    select: 'name email'
  })
  
  next();
})


const Response = mongoose.model('Response', responseSchema);

module.exports = Response;