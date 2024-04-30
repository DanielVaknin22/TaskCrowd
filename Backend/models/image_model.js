const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  labels: [
    {
      type: String,
      required: false
    }
]
});

module.exports = mongoose.model('Image', imageSchema);
