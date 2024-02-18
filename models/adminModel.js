const { Schema, model } = require('mongoose');

const adminSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email uniqueness in the database
    lowercase: true, // Converts email to lowercase
    trim: true // Removes whitespace from both ends of the string
  },
  password: {
    type: String,
    required: true,
    select: false // Excludes the password field by default when querying
  },
  image: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = model('admins', adminSchema);
