const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  response: [ 
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Response',
    }
  ],
  name: {
    type: String,
    required: [true, 'Please provide your name']
  },
  email: {
    type: String, 
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  role: {
    type: String,
    default: 'candidate',
    enum: ['admin', 'candidate', 'recruiter']
  },
  organization: {
    type: 'String',
    required: [ 
      function() {
        return this.role === 'recruiter'
      },
      'Please provide your Organization Name'
    ]
  },
  password: {
    type: String, 
    required: [true, 'Please provide your password'],
    minlength: [8, 'Password must be of minimum 8 characters'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: [8, 'Password must be of minimum 8 characters'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Passwords do not match'
    },
    select: false
  },
  passwordChangedAt: Date,
  active:{
    type: Boolean,
    default: true,
    select: false
  }
});


// Encrypting password before saving
userSchema.pre('save', async function(next) {
  if(!this.isModified('password'))
  return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  
  next();
});

// Setting passwordChangedAt
userSchema.pre('save', async function(next) {
  if(!this.isModified('password') || this.isNew)
  return next();
  
  this.passwordChangedAt = Date.now() - 1000;
  next();
});


// Verify Password
userSchema.methods.verifyPassword = async function(candidatePassword, password) {
  return await bcrypt.compare(candidatePassword, password);
}

// Check if password is changed before or after the issue of JWT
userSchema.methods.compareChangedPasswordTime = function(JWTTimeStamp) {
  if(this.passwordChangedAt) {
    this.timeStamp = this.passwordChangedAt.getTime() / 1000;
    return this.timeStamp > JWTTimeStamp;
  }
  // Password changed before JWTTimeStamp
  return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;