// SLAAC DATA VIEWER Backend Server
// This file sets up the Express server and API endpoints

const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db'); // Database connection and query functions

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for development (optional, but useful)
app.use(cors());

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint: Search parcels by Parcel ID or Owner Name in a specified table
app.get('/api/parcels/search', async (req, res) => {
  const q = req.query.q;
  const table = req.query.table || 'sheema'; // Default to 'sheema' if not provided

  if (!q) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  try {
    // Query the database for matching parcels in the specified table
    const parcels = await db.searchParcels(q, table);

    // Return as GeoJSON FeatureCollection
    res.json({
      type: "FeatureCollection",
      features: parcels
    });
  } catch (err) {
    console.error('Error in /api/parcels/search:', err);
    res.status(500).json({ error: 'Database error or invalid table' });
  }
});

// API endpoint: Get available tables for dropdown
app.get('/api/parcels/tables', async (req, res) => {
  try {
    const tables = await db.getAvailableTables();
    res.json({ tables });
  } catch (err) {
    console.error('Error in /api/parcels/tables:', err);
    res.status(500).json({ error: 'Could not fetch available tables' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`SLAAC DATA VIEWER backend running at http://localhost:${PORT}`);
});
