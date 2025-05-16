const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  text: {type: String, required: true}, 
  deadline: {type: String},
  priority: {type: String, default: 'low'},
  category: {type: String, default: 'other'},
  completed: {type: Boolean, required: false},
  timeStamp: {type: Date, default: () => new Date().toISOString()},
});

module.exports = mongoose.model('Task', taskSchema);