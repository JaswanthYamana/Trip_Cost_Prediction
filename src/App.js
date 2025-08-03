import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    destination: 'Sydney, Australia',
    duration: '7',
    age: '33',
    gender: 'Male',
    nationality: 'Canadian',
    accommodation: 'Airbnb',
    transportation: 'Train'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Popular destinations for suggestions
  const popularDestinations = [
    'Paris, France',
    'Tokyo, Japan',
    'New York, USA',
    'London, UK',
    'Sydney, Australia',
    'Bali, Indonesia',
    'Barcelona, Spain',
    'Rome, Italy',
    'Bangkok, Thailand',
    'Dubai, UAE'
  ];

  // Validate form data
  useEffect(() => {
    const isValid = formData.destination.trim() !== '' && 
                   parseInt(formData.duration) > 0 && 
                   parseInt(formData.age) > 0;
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setLoading(true);
    setError(null);
    setShowSuccess(false);
    
    try {
      const response = await axios.post('http://localhost:5000/predict', formData);
      setPrediction(response.data);
      setShowSuccess(true);
      
      // Hide success animation after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationSuggestion = (destination) => {
    setFormData({
      ...formData,
      destination
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTotalCost = () => {
    if (!prediction) return 0;
    return parseFloat(prediction.accommodation_cost) + parseFloat(prediction.transportation_cost);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌍 Travel Cost Predictor</h1>
        <p>Get accurate estimates for your dream vacation</p>
      </header>

      <main className="app-main">
        <div className="prediction-form-container">
          <form onSubmit={handleSubmit} className="prediction-form">
            <div className="form-row">
              <div className="form-group">
                <label>🏝️ Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  placeholder="Enter destination city/country"
                  className={formData.destination.trim() === '' ? 'error' : ''}
                />
                <div className="destination-suggestions">
                  <small>Popular destinations:</small>
                  <div className="suggestion-tags">
                    {popularDestinations.slice(0, 5).map((dest, index) => (
                      <button
                        key={index}
                        type="button"
                        className="suggestion-tag"
                        onClick={() => handleDestinationSuggestion(dest)}
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>📅 Duration (days)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  max="365"
                  required
                  placeholder="Trip duration in days"
                  className={parseInt(formData.duration) <= 0 ? 'error' : ''}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>👤 Traveler Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  required
                  placeholder="Your age"
                  className={parseInt(formData.age) <= 0 ? 'error' : ''}
                />
              </div>

              <div className="form-group">
                <label>👥 Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>🌍 Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                placeholder="Your nationality"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>🏨 Accommodation Type</label>
                <select name="accommodation" value={formData.accommodation} onChange={handleChange}>
                  <option value="Hotel">🏨 Hotel</option>
                  <option value="Airbnb">🏠 Airbnb</option>
                  <option value="Hostel">🛏️ Hostel</option>
                  <option value="Resort">🏖️ Resort</option>
                </select>
              </div>

              <div className="form-group">
                <label>🚗 Transportation Type</label>
                <select name="transportation" value={formData.transportation} onChange={handleChange}>
                  <option value="Flight">✈️ Flight</option>
                  <option value="Train">🚂 Train</option>
                  <option value="Bus">🚌 Bus</option>
                  <option value="Car">🚗 Car</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !isFormValid} 
              className={`predict-button ${!isFormValid ? 'invalid' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Predicting...
                </>
              ) : (
                <>
                  <span>🔮</span>
                  Predict Travel Costs
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
            </div>
          )}
        </div>

        {prediction && (
          <div className={`prediction-results ${showSuccess ? 'success' : ''}`}>
            <h2>🎉 Estimated Travel Costs</h2>
            <div className="cost-cards">
              <div className="cost-card accommodation">
                <h3>🏨 Accommodation</h3>
                <p className="cost">{formatCurrency(prediction.accommodation_cost)}</p>
                <p className="cost-label">for your entire stay</p>
                <div className="cost-details">
                  <small>~{formatCurrency(prediction.accommodation_cost / parseInt(formData.duration))} per day</small>
                </div>
              </div>
              
              <div className="cost-card transportation">
                <h3>🚗 Transportation</h3>
                <p className="cost">{formatCurrency(prediction.transportation_cost)}</p>
                <p className="cost-label">round trip</p>
                <div className="cost-details">
                  <small>~{formatCurrency(prediction.transportation_cost / 2)} each way</small>
                </div>
              </div>
              
              <div className="cost-card total">
                <h3>💰 Total Estimated Cost</h3>
                <p className="cost">{formatCurrency(getTotalCost())}</p>
                <p className="cost-label">for your trip</p>
                <div className="cost-details">
                  <small>~{formatCurrency(getTotalCost() / parseInt(formData.duration))} per day</small>
                </div>
              </div>
            </div>
            
            <div className="trip-summary">
              <h4>📋 Trip Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Destination:</span>
                  <span className="summary-value">{formData.destination}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Duration:</span>
                  <span className="summary-value">{formData.duration} days</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Accommodation:</span>
                  <span className="summary-value">{formData.accommodation}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Transportation:</span>
                  <span className="summary-value">{formData.transportation}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>✨ Travel Cost Prediction Model v2.0 - Powered by AI</p>
      </footer>
    </div>
  );
}

export default App;