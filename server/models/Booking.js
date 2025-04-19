const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    bookingRef: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    customerName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'ongoing', 'cancelled', 'completed', 'pending'],
        default: 'pending'
    },
    bookingDate: {
        type: Date,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    cancelReason: {
        type: String
    },
    cancelDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model('booking', bookingSchema, 'booking');

module.exports = Booking;