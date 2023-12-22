import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
  airportName: {
    type: String,
    required: true,
  },
  airportID: {
    type: String,   
    required: true,
    unique: true,
  },
  isBusy: {
    type: Boolean,
    default: false,
  },
  lastLanding: {
    type: Date,
    default: null,
  },
});

const Airport = mongoose.model('Airport', airportSchema);

export default Airport;
