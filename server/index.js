const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const bookingRoutes = require('./routes/bookingRoutes');
const intentRoutes = require('./routes/intentRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Atlas connection string
const uri = "mongodb+srv://dinaraayaganovua:Iyjv6iSRFssrrQO5@dinara.ztsjlvk.mongodb.net/?retryWrites=true&w=majority&appName=Dinara";

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Make the client accessible to route handlers
let db;

async function connectToDatabase() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    
    // Assign the database to the db variable
    db = client.db("DIA"); 
    
    console.log("Successfully connected to MongoDB Atlas!");
    
    // Start the Express server after database connection is established
    app.listen(3001, () => {
      console.log("Server is running on port 3001");
    });
    
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

// Make the database accessible to route handlers
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Use routes
app.use('/api/bookings', bookingRoutes);
app.use('/api', intentRoutes);

// Connect to the database
connectToDatabase();

// Handle application shutdown
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});