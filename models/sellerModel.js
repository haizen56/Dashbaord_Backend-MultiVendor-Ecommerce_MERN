const { Schema, model } = require('mongoose');

const sellerSchema = new Schema({
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

  role: {
    type: String,
    default: 'seller'
  },


  status: {
    type: String,
    default: 'pending'
  },


  payment: {
    type: String,
    default: 'inactive'
  },

  method: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    default: ''
  },

  shopInfo: {
    type: Object,
    default: {}
  },

}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = model('sellers', sellerSchema);
