const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Vehicle Information
  make: {
    type: String,
    required: [true, 'Vehicle make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Vehicle year is required'],
    min: [1950, 'Vehicle year must be after 1950'],
    max: [new Date().getFullYear() + 1, 'Vehicle year cannot be in the future']
  },
  color: {
    type: String,
    required: [true, 'Vehicle color is required'],
    trim: true
  },
  engineNumber: {
    type: String,
    required: [true, 'Engine number is required'],
    unique: true,
    trim: true
  },
  chassisNumber: {
    type: String,
    required: [true, 'Chassis number is required'],
    unique: true,
    trim: true
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['Car', 'Motorcycle', 'Truck', 'Bus', 'Van', 'SUV', 'Trailer']
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG']
  },
  // Registration Information
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true // Allows null values but ensures uniqueness when present
  },
  previousRegistration: {
    number: String,
    expiryDate: Date,
    issuingAuthority: String
  },
  // Application Details
  applicationType: {
    type: String,
    required: true,
    enum: ['New Registration', 'Transfer', 'Renewal', 'Replacement']
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Completed']
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  reviewDate: Date,
  completionDate: Date,
  // Documents
  documents: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  // Insurance Information
  insurance: {
    company: String,
    policyNumber: String,
    expiryDate: Date
  },
  // Technical Information
  technical: {
    weight: Number,
    seatingCapacity: Number,
    engineCapacity: Number,
    horsePower: Number
  },
  // Admin Notes
  adminNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Fees
  fees: {
    registrationFee: {
      type: Number,
      default: 0
    },
    penaltyFee: {
      type: Number,
      default: 0
    },
    totalFee: {
      type: Number,
      default: 0
    },
    paymentStatus: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Paid', 'Waived']
    },
    paymentDate: Date
  }
}, {
  timestamps: true
});

// Generate registration number
vehicleSchema.methods.generateRegistrationNumber = function() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `REG-${year}-${randomNum}`;
};

// Calculate total fees
vehicleSchema.pre('save', function(next) {
  if (this.fees.registrationFee !== undefined && this.fees.penaltyFee !== undefined) {
    this.fees.totalFee = this.fees.registrationFee + this.fees.penaltyFee;
  }
  next();
});

// Index for better query performance
vehicleSchema.index({ user: 1, status: 1 });
vehicleSchema.index({ registrationNumber: 1 });
vehicleSchema.index({ submissionDate: -1 });

// Drop plateNumber and VIN indexes if they exist
const Vehicle = mongoose.model('Vehicle', vehicleSchema);
Vehicle.collection.dropIndex('plateNumber_1').catch(err => {
  if (err.code !== 26) { // 26 is the error code for "namespace not found"
    console.error('Error dropping plateNumber index:', err);
  }
});
Vehicle.collection.dropIndex('vin_1').catch(err => {
  if (err.code !== 26) { // 26 is the error code for "namespace not found"
    console.error('Error dropping VIN index:', err);
  }
});

module.exports = Vehicle; 