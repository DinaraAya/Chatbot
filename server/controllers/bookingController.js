// Replace Mongoose model with MongoDB native queries
const checkBookingStatus = async (req, res) => {
  try {
    const { bookingReference } = req.body;
    
    // Check if booking reference is valid
    if (!bookingReference || bookingReference.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Please enter a valid booking reference',
        step: 'validation'
      });
    }
    
    // Get the bookings collection
    const bookingsCollection = req.db.collection('booking'); // Use the collection name that matches your database
    
    // Find booking in database
    const booking = await bookingsCollection.findOne({ bookingRef: bookingReference });
    
    // Check if booking exists
    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found. Please check your booking reference.',
        step: 'notFound'
      });
    }
    
    // Check if booking is active/ongoing
    if (booking.status === 'active' || booking.status === 'ongoing') {
      return res.status(200).json({
        status: 'success',
        message: 'Booking found and active',
        data: {
          bookingDate: booking.bookingDate,
          status: booking.status,
          details: booking
        },
        step: 'active'
      });
    }
    
    // Check if booking is cancelled
    if (booking.status === 'cancelled') {
      return res.status(200).json({
        status: 'cancelled',
        message: 'This booking has been cancelled',
        data: {
          cancelReason: booking.cancelReason,
          cancelDate: booking.cancelDate,
          details: booking
        },
        step: 'cancelled'
      });
    }
    
    // If not active or cancelled, it's not in transit
    return res.status(200).json({
      status: 'inactive',
      message: 'This booking is not in transit anymore',
      data: {
        status: booking.status,
        details: booking
      },
      step: 'notInTransit'
    });
  } catch (error) {
    console.error('Error checking booking status:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while checking your booking status',
      error: error.message
    });
  }
};

module.exports = { checkBookingStatus };