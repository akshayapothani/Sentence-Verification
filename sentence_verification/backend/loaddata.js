const mongoose = require('mongoose');
const fs = require('fs');
const GameData = require('./models/GameData'); // Import your GameData model

// MongoDB URI
const mongoUri = 'mongodb://localhost:27017/SentenceVerification';

// Connect to MongoDB Atlas
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Read the JSON file
fs.readFile('./gameData.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the JSON data
  const gameDataArray = JSON.parse(data);

  // Insert the data into MongoDB
  GameData.insertMany(gameDataArray)
    .then(() => {
      console.log('Game data inserted successfully!');
      mongoose.connection.close(); // Close the connection after insertion
    })
    .catch((error) => {
      console.error('Error inserting data:', error);
      mongoose.connection.close(); // Close the connection on error
    });
});
