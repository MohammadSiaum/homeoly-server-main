const mongoose = require('mongoose');

// Define the schema
const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  image: {
    type: String,
    required: false
  },

  medicalName: {
    type: String,
    required: true,
  },
  degrees: {
    type: [String],
    required: true
  },
  registrationNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  // specialty: {
  //   type: String,
  //   required: false
  // },
  gender: {
    type: String,
    required: true
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
    zip: {
        type: String,
        required: false,
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
    zip: {
        type: String,
        required: false,
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
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
