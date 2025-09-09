// Sample Backend API for Smart Dustbin Tracker
// This is an example of how to structure your backend API

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data structure
let dustbinData = {
    subBins: {
        recyclable: { volume: 0, percentage: 0, maxVolume: 5 },
        compost: { volume: 0, percentage: 0, maxVolume: 5 },
        general: { volume: 0, percentage: 0, maxVolume: 5 },
        hazardous: { volume: 0, percentage: 0, maxVolume: 5 }
    },
    location: {
        latitude: null,
        longitude: null,
        address: 'Loading...'
    },
    alerts: [],
    activities: [],
    totalWaste: 0,
    binsNearingFull: 0,
    lastUpdated: new Date()
};

// API Routes

// Get all data
app.get('/api/data', (req, res) => {
    res.json(dustbinData);
});

// Get specific bin data
app.get('/api/bins/:binId', (req, res) => {
    const binId = req.params.binId;
    if (dustbinData.subBins[binId]) {
        res.json(dustbinData.subBins[binId]);
    } else {
        res.status(404).json({ error: 'Bin not found' });
    }
});

// Update bin data
app.put('/api/bins/:binId', (req, res) => {
    const binId = req.params.binId;
    const { volume, percentage } = req.body;
    
    if (dustbinData.subBins[binId]) {
        dustbinData.subBins[binId].volume = volume;
        dustbinData.subBins[binId].percentage = percentage;
        dustbinData.lastUpdated = new Date();
        
        // Update total waste
        dustbinData.totalWaste = Object.values(dustbinData.subBins)
            .reduce((sum, bin) => sum + bin.volume, 0);
        
        // Update bins nearing full count
        dustbinData.binsNearingFull = Object.values(dustbinData.subBins)
            .filter(bin => bin.percentage >= 80).length;
        
        res.json({ success: true, data: dustbinData.subBins[binId] });
    } else {
        res.status(404).json({ error: 'Bin not found' });
    }
});

// Update location
app.put('/api/location', (req, res) => {
    const { latitude, longitude, address } = req.body;
    
    dustbinData.location = {
        latitude,
        longitude,
        address: address || 'Unknown location'
    };
    dustbinData.lastUpdated = new Date();
    
    res.json({ success: true, data: dustbinData.location });
});

// Add alert
app.post('/api/alerts', (req, res) => {
    const { type, message, severity } = req.body;
    
    const alert = {
        id: Date.now(),
        type,
        message,
        severity,
        timestamp: new Date()
    };
    
    dustbinData.alerts.unshift(alert);
    
    // Keep only last 10 alerts
    if (dustbinData.alerts.length > 10) {
        dustbinData.alerts = dustbinData.alerts.slice(0, 10);
    }
    
    dustbinData.lastUpdated = new Date();
    
    res.json({ success: true, data: alert });
});

// Add activity
app.post('/api/activities', (req, res) => {
    const { message } = req.body;
    
    const activity = {
        id: Date.now(),
        message,
        timestamp: new Date()
    };
    
    dustbinData.activities.unshift(activity);
    
    // Keep only last 15 activities
    if (dustbinData.activities.length > 15) {
        dustbinData.activities = dustbinData.activities.slice(0, 15);
    }
    
    dustbinData.lastUpdated = new Date();
    
    res.json({ success: true, data: activity });
});

// Get alerts
app.get('/api/alerts', (req, res) => {
    res.json(dustbinData.alerts);
});

// Get activities
app.get('/api/activities', (req, res) => {
    res.json(dustbinData.activities);
});

// Clear alerts
app.delete('/api/alerts', (req, res) => {
    dustbinData.alerts = [];
    dustbinData.lastUpdated = new Date();
    res.json({ success: true });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date(),
        data: {
            totalWaste: dustbinData.totalWaste,
            binsNearingFull: dustbinData.binsNearingFull,
            lastUpdated: dustbinData.lastUpdated
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Smart Dustbin API server running on port ${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api/`);
});

// Simulate real-time data updates (for testing)
setInterval(() => {
    // Simulate random data changes
    Object.keys(dustbinData.subBins).forEach(binId => {
        const bin = dustbinData.subBins[binId];
        const increase = Math.random() * 0.1;
        bin.volume = Math.min(bin.volume + increase, bin.maxVolume);
        bin.percentage = (bin.volume / bin.maxVolume) * 100;
    });
    
    // Update totals
    dustbinData.totalWaste = Object.values(dustbinData.subBins)
        .reduce((sum, bin) => sum + bin.volume, 0);
    
    dustbinData.binsNearingFull = Object.values(dustbinData.subBins)
        .filter(bin => bin.percentage >= 80).length;
    
    dustbinData.lastUpdated = new Date();
    
    console.log('Data updated:', {
        totalWaste: dustbinData.totalWaste.toFixed(2),
        binsNearingFull: dustbinData.binsNearingFull
    });
}, 10000); // Update every 10 seconds

module.exports = app;