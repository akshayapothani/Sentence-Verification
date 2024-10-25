const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // To handle cross-origin requests
const GameData = require('./models/GameData');
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse incoming JSON data

// MongoDB Connection
const mongoUri = 'mongodb://localhost:27017/SentenceVerification'; // Replace <username>, <password>, <dbname>

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Define a schema and model (optional, for example data structure)
// const gameSchema = new mongoose.Schema({
//   screen: Number,
//   images: [String],
//   sentence: String,
//   correctAnswer: String
// });

// const GameData = mongoose.model('GameData', gameSchema);

// Sample route to get all game data
app.get('/game-data', async (req, res) => {
  try {
    const gameData = await GameData.find(); // Retrieve all game data from MongoDB
    res.json(gameData); // Send the game data back as JSON
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game data' });
  }
});

// Sample route to add game data
app.post('/game-data', async (req, res) => {
  const newGameData = new GameData(req.body);
  try {
    await newGameData.save(); // Save new game data to MongoDB
    res.json({ message: 'Game data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save game data' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
