const { Schema, model } = require('mongoose');

const sellerCustomerSchema = new Schema({
 
  myId:{
    type: String,
    required: true
  },

  myFriends:{
    type: Array,
    default: {}
  }


}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = model('seller_customers', sellerCustomerSchema);
