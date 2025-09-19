const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema(
    {
  title: { 
    type: String, 
    required: true, 
    trim: true 
},
  description: { 
    type: String, 
    default: '' 
},
  dueDate: { 
    type: Date, 
    required: true 
},
  status: { 
    type: String, 
    enum: ['Draft','Published','Completed'], 
    default: 'Draft' 
},
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', required: true 
}
}, { 
    timestamps: true 
}
);

module.exports = mongoose.model('Assignment', AssignmentSchema);