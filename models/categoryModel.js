const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
 

  image: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

categorySchema.index({
    name:'text'
})

module.exports = model('categorys', categorySchema);
