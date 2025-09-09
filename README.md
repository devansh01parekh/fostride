# Smart Dustbin Tracker

A real-time web dashboard for tracking smart dustbin data with waste segregation capabilities. This system monitors 4 sub-bins (Recyclable, Compost, General Waste, Hazardous) and provides live updates, GPS location tracking, and data visualization.

## Features

### 🗑️ Waste Segregation Tracking
- **4 Sub-bins**: Recyclable, Compost, General Waste, Hazardous
- **Volume Tracking**: Each sub-bin has a 5-liter capacity
- **Real-time Fill Levels**: Visual indicators and percentage displays
- **Overflow Alerts**: Notifications when bins reach 80%+ capacity

### 📊 Data Visualization
- **Fill Level Trends**: Line chart showing waste accumulation over time
- **Segregation Breakdown**: Doughnut chart displaying waste distribution
- **Sub-bin Status Cards**: Individual bin monitoring with progress bars
- **Real-time Metrics**: Total waste collected, bins nearing full, active bins

### 📍 Location Services
- **GPS Integration**: Real-time location tracking
- **Wi-Fi Module Support**: Network-based positioning
- **Address Resolution**: Automatic location-to-address conversion
- **Location Status**: Connection status monitoring

### 🔔 Smart Notifications
- **Overflow Alerts**: Critical alerts for bins at 90%+ capacity
- **Warning Alerts**: Early warnings for bins at 80%+ capacity
- **Activity Log**: Real-time log of bin activities and maintenance
- **Toast Notifications**: Non-intrusive popup alerts

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Modern UI**: Clean, professional dashboard design
- **Real-time Updates**: Live data refresh every 5 seconds
- **Interactive Charts**: Dynamic data visualization

## Technology Stack

### Frontend
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Real-time data management
- **Chart.js**: Interactive data visualization
- **Font Awesome**: Icon library

### Backend (Example)
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **RESTful API**: Standard API endpoints

## Quick Start

### 1. Frontend Setup
```bash
# Clone or download the project
cd smart-dustbin-tracker

# Open index.html in your browser
# Or serve with a local server:
python -m http.server 8000
# Then visit: http://localhost:8000
```

### 2. Backend Setup (Optional)
```bash
# Install dependencies
npm install

# Start the backend server
npm start

# The API will be available at: http://localhost:3000/api/
```

### 3. Backend Integration
Update the backend URL in `script.js`:
```javascript
this.backendUrl = 'http://your-backend-url/api';
```

## API Endpoints

### Data Endpoints
- `GET /api/data` - Get all dustbin data
- `GET /api/bins/:binId` - Get specific bin data
- `PUT /api/bins/:binId` - Update bin data
- `PUT /api/location` - Update GPS location

### Alert & Activity Endpoints
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Add new alert
- `DELETE /api/alerts` - Clear all alerts
- `GET /api/activities` - Get activity log
- `POST /api/activities` - Add new activity

### System Endpoints
- `GET /api/health` - Health check and system status

## Data Structure

### Sub-bin Data
```javascript
{
  "recyclable": {
    "volume": 2.5,        // Current volume in liters
    "percentage": 50.0,   // Fill percentage (0-100)
    "maxVolume": 5        // Maximum capacity in liters
  },
  // ... similar for compost, general, hazardous
}
```

### Location Data
```javascript
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "New York, NY"
}
```

### Alert Data
```javascript
{
  "id": 1234567890,
  "type": "overflow",     // overflow, warning, maintenance, cleaning
  "message": "Recyclable bin is at 90%",
  "severity": "critical", // critical, warning, info
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Hardware Integration

### Required Components
- **Microcontroller**: ESP32 or Arduino with WiFi
- **Sensors**: Ultrasonic or weight sensors for each sub-bin
- **GPS Module**: For location tracking
- **WiFi Module**: For data transmission
- **Power Supply**: Battery or mains power

### Sensor Integration
```javascript
// Example sensor data structure
const sensorData = {
  binId: "recyclable",
  distance: 15.5,        // Distance in cm (for ultrasonic)
  volume: 2.3,           // Calculated volume in liters
  timestamp: Date.now()
};
```

### Data Transmission
```javascript
// Send data to backend
fetch('http://your-backend/api/bins/recyclable', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    volume: sensorData.volume,
    percentage: (sensorData.volume / 5) * 100
  })
});
```

## Customization

### Adding New Bin Types
1. Update the `subBins` object in `script.js`
2. Add corresponding HTML elements in `index.html`
3. Update CSS styles for new bin colors/icons
4. Modify chart data processing

### Changing Alert Thresholds
```javascript
// In script.js, modify the checkAlerts() function
if (binData.percentage >= 90) {  // Critical threshold
    this.addAlert('overflow', message, 'critical');
} else if (binData.percentage >= 80) {  // Warning threshold
    this.addAlert('warning', message, 'warning');
}
```

### Styling Customization
- Modify `styles.css` for color schemes, layouts, and responsive breakpoints
- Update icon classes in HTML for different bin types
- Customize chart colors in the `setupCharts()` function

## Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## Security Considerations

- **HTTPS**: Use secure connections in production
- **API Authentication**: Implement proper authentication for backend
- **Data Validation**: Validate all incoming sensor data
- **Rate Limiting**: Implement rate limiting for API endpoints

## Performance Optimization

- **Data Caching**: Cache frequently accessed data
- **Chart Optimization**: Limit data points for better performance
- **Image Optimization**: Use optimized icons and images
- **CDN**: Use CDN for external libraries

## Troubleshooting

### Common Issues

1. **Charts not displaying**
   - Check if Chart.js is loaded correctly
   - Verify canvas elements exist in DOM

2. **Location not updating**
   - Ensure HTTPS is enabled for geolocation
   - Check browser permissions for location access

3. **Real-time updates not working**
   - Verify backend URL is correct
   - Check network connectivity
   - Review browser console for errors

4. **Responsive layout issues**
   - Test on different screen sizes
   - Check CSS media queries
   - Verify viewport meta tag

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Note**: This is a template/example implementation. Adapt the code according to your specific hardware setup and requirements.