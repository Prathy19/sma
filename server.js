const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // For serving static HTML files

// In-memory storage for fixtures
let fixtures = [];

// API to add a fixture
app.post('/api/fixture', (req, res) => {
  const fixture = req.body;
  fixtures.push(fixture);
  io.emit('fixtureUpdated', fixtures); // Notify clients about updates
  res.status(201).json({ message: 'Fixture created successfully', fixture });
});

// API to get all fixtures
app.get('/api/fixtures', (req, res) => {
  res.json(fixtures);
});

// API to clear fixtures
app.delete('/api/fixtures', (req, res) => {
  fixtures = [];
  io.emit('fixtureUpdated', fixtures); // Notify clients about updates
  res.status(200).json({ message: 'All fixtures cleared' });
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('fixtureUpdated', fixtures); // Send current fixtures to the new client
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
