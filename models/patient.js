const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  
  image: {
      type: String,
      required: false
  },

  fullName: {
    type: String,
    required: true,
  },

  dateOfBirth: {
    type: Date,
    required: false
  },

  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },

  phone: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  religion: {
    type: String,
    required: true
  },

  presentAddress: {
    country: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    apartment: {
      type: String,
      required: true
    }
  },

  permanentAddress: {
    country: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    apartment: {
      type: String,
      required: true
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the updatedAt field
patientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
