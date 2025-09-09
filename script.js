// Smart Dustbin Tracker - Real-time Data Management
class SmartDustbinTracker {
    constructor() {
        this.data = {
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
            binsNearingFull: 0
        };
        
        this.charts = {};
        this.refreshInterval = null;
        this.backendUrl = 'http://localhost:3000/api'; // Change this to your backend URL
        
        this.init();
    }

    init() {
        this.setupCharts();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.getLocation();
        this.loadInitialData();
    }

    // Chart Setup
    setupCharts() {
        // Fill Level Trend Chart
        const fillCtx = document.getElementById('fillLevelChart').getContext('2d');
        this.charts.fillLevel = new Chart(fillCtx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(),
                datasets: [{
                    label: 'Total Fill Level',
                    data: this.generateFillData(),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });

        // Segregation Breakdown Chart
        const segCtx = document.getElementById('segregationChart').getContext('2d');
        this.charts.segregation = new Chart(segCtx, {
            type: 'doughnut',
            data: {
                labels: ['Recyclable', 'Compost', 'General Waste', 'Hazardous'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#6b7280',
                        '#ef4444'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    // Event Listeners
    setupEventListeners() {
        // Time range selector
        document.getElementById('timeRange').addEventListener('change', (e) => {
            this.updateFillLevelChart(e.target.value);
        });

        // Refresh button
        document.querySelector('.refresh-btn').addEventListener('click', () => {
            this.refreshData();
        });
    }

    // Real-time Data Updates
    startRealTimeUpdates() {
        // Update data every 5 seconds
        this.refreshInterval = setInterval(() => {
            this.updateData();
        }, 5000);

        // Initial update
        this.updateData();
    }

    async updateData() {
        try {
            // Simulate real-time data updates
            this.simulateDataUpdate();
            
            // If you have a backend, uncomment the following lines:
            // const response = await fetch(`${this.backendUrl}/data`);
            // const data = await response.json();
            // this.processBackendData(data);
            
            this.updateUI();
            this.updateCharts();
            this.checkAlerts();
        } catch (error) {
            console.error('Error updating data:', error);
            this.showNotification('Error updating data', 'error');
        }
    }

    // Simulate data updates (replace with actual backend data)
    simulateDataUpdate() {
        const bins = ['recyclable', 'compost', 'general', 'hazardous'];
        
        bins.forEach(bin => {
            // Random volume increase
            const increase = Math.random() * 0.5;
            this.data.subBins[bin].volume = Math.min(
                this.data.subBins[bin].volume + increase,
                this.data.subBins[bin].maxVolume
            );
            this.data.subBins[bin].percentage = 
                (this.data.subBins[bin].volume / this.data.subBins[bin].maxVolume) * 100;
        });

        // Update total waste
        this.data.totalWaste = Object.values(this.data.subBins)
            .reduce((sum, bin) => sum + bin.volume, 0);

        // Count bins nearing full (80%+)
        this.data.binsNearingFull = Object.values(this.data.subBins)
            .filter(bin => bin.percentage >= 80).length;

        // Add random activities
        if (Math.random() < 0.3) {
            this.addRandomActivity();
        }
    }

    // Process backend data (uncomment when you have a backend)
    processBackendData(data) {
        if (data.subBins) {
            this.data.subBins = data.subBins;
        }
        if (data.location) {
            this.data.location = data.location;
        }
        if (data.alerts) {
            this.data.alerts = data.alerts;
        }
        if (data.activities) {
            this.data.activities = data.activities;
        }
    }

    // Update UI Elements
    updateUI() {
        // Update metric cards
        document.getElementById('totalWaste').textContent = 
            `${this.data.totalWaste.toFixed(1)} L`;
        
        document.getElementById('binsNearingFull').textContent = 
            this.data.binsNearingFull;
        
        document.getElementById('locationStatus').textContent = 
            this.data.location.latitude ? 'GPS Connected' : 'GPS Disconnected';
        
        document.getElementById('locationCoords').textContent = 
            this.data.location.latitude ? 
            `${this.data.location.latitude.toFixed(4)}, ${this.data.location.longitude.toFixed(4)}` :
            'Location unavailable';

        // Update sub-bin status
        Object.keys(this.data.subBins).forEach(bin => {
            const binData = this.data.subBins[bin];
            document.getElementById(`${bin}Fill`).style.width = `${binData.percentage}%`;
            document.getElementById(`${bin}Percent`).textContent = `${binData.percentage.toFixed(1)}%`;
            document.getElementById(`${bin}Volume`).textContent = 
                `${binData.volume.toFixed(1)}/${binData.maxVolume} L`;
        });

        // Update alerts
        this.updateAlertsList();
        
        // Update activities
        this.updateActivitiesList();
    }

    // Update Charts
    updateCharts() {
        // Update segregation chart
        this.charts.segregation.data.datasets[0].data = [
            this.data.subBins.recyclable.volume,
            this.data.subBins.compost.volume,
            this.data.subBins.general.volume,
            this.data.subBins.hazardous.volume
        ];
        this.charts.segregation.update();

        // Update fill level chart with new data point
        const now = new Date();
        const timeLabel = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const totalFillPercentage = Object.values(this.data.subBins)
            .reduce((sum, bin) => sum + bin.percentage, 0) / 4;

        this.charts.fillLevel.data.labels.push(timeLabel);
        this.charts.fillLevel.data.datasets[0].data.push(totalFillPercentage);

        // Keep only last 20 data points
        if (this.charts.fillLevel.data.labels.length > 20) {
            this.charts.fillLevel.data.labels.shift();
            this.charts.fillLevel.data.datasets[0].data.shift();
        }

        this.charts.fillLevel.update('none');
    }

    // Alert Management
    checkAlerts() {
        Object.keys(this.data.subBins).forEach(bin => {
            const binData = this.data.subBins[bin];
            const binName = bin.charAt(0).toUpperCase() + bin.slice(1);
            
            if (binData.percentage >= 90) {
                this.addAlert('overflow', `${binName} bin is at ${binData.percentage.toFixed(1)}%`, 'critical');
            } else if (binData.percentage >= 80) {
                this.addAlert('warning', `${binName} bin is at ${binData.percentage.toFixed(1)}%`, 'warning');
            }
        });
    }

    addAlert(type, message, severity) {
        const alert = {
            id: Date.now(),
            type,
            message,
            severity,
            timestamp: new Date()
        };

        // Check if similar alert already exists
        const existingAlert = this.data.alerts.find(a => 
            a.type === type && a.message === message
        );

        if (!existingAlert) {
            this.data.alerts.unshift(alert);
            this.showNotification(message, severity);
            
            // Keep only last 10 alerts
            if (this.data.alerts.length > 10) {
                this.data.alerts = this.data.alerts.slice(0, 10);
            }
        }
    }

    updateAlertsList() {
        const alertsList = document.getElementById('alertsList');
        const alertCount = document.getElementById('alertCount');
        
        alertCount.textContent = this.data.alerts.length;
        
        alertsList.innerHTML = this.data.alerts.map(alert => `
            <div class="alert-item ${alert.type}">
                <div class="alert-icon">
                    <i class="fas fa-${this.getAlertIcon(alert.type)}"></i>
                </div>
                <div class="alert-content">
                    <h4>${alert.message}</h4>
                    <p>${alert.timestamp.toLocaleTimeString()}</p>
                </div>
            </div>
        `).join('');
    }

    getAlertIcon(type) {
        const icons = {
            overflow: 'exclamation-triangle',
            warning: 'exclamation-circle',
            maintenance: 'wrench',
            cleaning: 'broom'
        };
        return icons[type] || 'info-circle';
    }

    // Activities Management
    addRandomActivity() {
        const activities = [
            'Waste added to Recyclable bin',
            'Compost bin emptied',
            'General waste collected',
            'Hazardous waste disposed',
            'Bin maintenance completed',
            'Sensor calibration performed'
        ];
        
        const activity = {
            id: Date.now(),
            message: activities[Math.floor(Math.random() * activities.length)],
            timestamp: new Date()
        };
        
        this.data.activities.unshift(activity);
        
        // Keep only last 15 activities
        if (this.data.activities.length > 15) {
            this.data.activities = this.data.activities.slice(0, 15);
        }
    }

    updateActivitiesList() {
        const activitiesList = document.getElementById('activitiesList');
        
        activitiesList.innerHTML = this.data.activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-circle"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.message}</h4>
                    <p>${activity.timestamp.toLocaleTimeString()}</p>
                </div>
            </div>
        `).join('');
    }

    // Location Services
    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.data.location.latitude = position.coords.latitude;
                    this.data.location.longitude = position.coords.longitude;
                    this.reverseGeocode(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.data.location.address = 'Location access denied';
                }
            );
        } else {
            this.data.location.address = 'Geolocation not supported';
        }
    }

    async reverseGeocode(lat, lng) {
        try {
            // Using a free geocoding service (you can replace with your preferred service)
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            const data = await response.json();
            this.data.location.address = `${data.city}, ${data.principalSubdivision}`;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            this.data.location.address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
    }

    // Utility Functions
    generateTimeLabels() {
        const labels = [];
        const now = new Date();
        for (let i = 19; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 5 * 60000); // 5-minute intervals
            labels.push(time.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }));
        }
        return labels;
    }

    generateFillData() {
        const data = [];
        for (let i = 0; i < 20; i++) {
            data.push(Math.random() * 100);
        }
        return data;
    }

    updateFillLevelChart(timeRange) {
        // This would update the chart based on the selected time range
        console.log('Updating chart for time range:', timeRange);
    }

    // Notification System
    showNotification(message, type = 'info') {
        const toast = document.getElementById('notificationToast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.style.display = 'flex';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.closeToast();
        }, 5000);
    }

    closeToast() {
        const toast = document.getElementById('notificationToast');
        toast.style.display = 'none';
    }

    // Public Methods
    refreshData() {
        this.updateData();
        this.showNotification('Data refreshed', 'success');
    }

    loadInitialData() {
        // Load initial data from backend or use defaults
        this.updateUI();
        this.updateCharts();
    }
}

// Global Functions
function refreshData() {
    if (window.dustbinTracker) {
        window.dustbinTracker.refreshData();
    }
}

function closeToast() {
    if (window.dustbinTracker) {
        window.dustbinTracker.closeToast();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.dustbinTracker = new SmartDustbinTracker();
});

// Backend Integration Example
class BackendIntegration {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async fetchData() {
        try {
            const response = await fetch(`${this.baseUrl}/data`);
            return await response.json();
        } catch (error) {
            console.error('Backend fetch error:', error);
            throw error;
        }
    }

    async sendData(data) {
        try {
            const response = await fetch(`${this.baseUrl}/data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Backend send error:', error);
            throw error;
        }
    }

    async updateBinStatus(binId, status) {
        try {
            const response = await fetch(`${this.baseUrl}/bins/${binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(status)
            });
            return await response.json();
        } catch (error) {
            console.error('Backend update error:', error);
            throw error;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SmartDustbinTracker, BackendIntegration };
}