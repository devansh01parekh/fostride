// Configuration file for Smart Dustbin Tracker
// Modify these settings according to your setup

const CONFIG = {
    // Backend Configuration
    backend: {
        url: 'http://localhost:3000/api',
        refreshInterval: 5000, // milliseconds
        timeout: 10000 // milliseconds
    },

    // Bin Configuration
    bins: {
        recyclable: {
            name: 'Recyclable',
            maxVolume: 5, // liters
            color: '#10b981',
            icon: 'fas fa-recycle',
            alertThreshold: 80, // percentage
            criticalThreshold: 90 // percentage
        },
        compost: {
            name: 'Compost',
            maxVolume: 5,
            color: '#f59e0b',
            icon: 'fas fa-leaf',
            alertThreshold: 80,
            criticalThreshold: 90
        },
        general: {
            name: 'General Waste',
            maxVolume: 5,
            color: '#6b7280',
            icon: 'fas fa-trash',
            alertThreshold: 80,
            criticalThreshold: 90
        },
        hazardous: {
            name: 'Hazardous',
            maxVolume: 5,
            color: '#ef4444',
            icon: 'fas fa-exclamation-triangle',
            alertThreshold: 80,
            criticalThreshold: 90
        }
    },

    // Chart Configuration
    charts: {
        fillLevel: {
            maxDataPoints: 20,
            updateInterval: 5000, // milliseconds
            yAxisMax: 100 // percentage
        },
        segregation: {
            animationDuration: 1000, // milliseconds
            legendPosition: 'bottom'
        }
    },

    // Alert Configuration
    alerts: {
        maxAlerts: 10,
        maxActivities: 15,
        notificationDuration: 5000, // milliseconds
        soundEnabled: false
    },

    // Location Configuration
    location: {
        enableGPS: true,
        enableGeocoding: true,
        geocodingService: 'bigdatacloud', // or 'google', 'mapbox', etc.
        updateInterval: 30000 // milliseconds
    },

    // UI Configuration
    ui: {
        theme: 'light', // 'light' or 'dark'
        language: 'en',
        dateFormat: 'en-US',
        timeFormat: '12h' // '12h' or '24h'
    },

    // Development Configuration
    development: {
        enableLogging: true,
        enableSimulation: true, // Enable simulated data for testing
        simulationInterval: 5000 // milliseconds
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}