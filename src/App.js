import React, { useState } from 'react';
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/predict', formData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Travel Cost Predictor</h1>
        <p>Get accurate estimates for your travel expenses</p>
      </header>

      <main className="app-main">
        <div className="prediction-form-container">
          <form onSubmit={handleSubmit} className="prediction-form">
            <div className="form-row">
              <div className="form-group">
                <label>Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  placeholder="Enter destination city/country"
                />
              </div>

              <div className="form-group">
                <label>Duration (days)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  required
                  placeholder="Trip duration in days"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Traveler Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  required
                  placeholder="Your age"
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Nationality</label>
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
                <label>Accommodation Type</label>
                <select name="accommodation" value={formData.accommodation} onChange={handleChange}>
                  <option value="Hotel">Hotel</option>
                  <option value="Airbnb">Airbnb</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Resort">Resort</option>
                </select>
              </div>

              <div className="form-group">
                <label>Transportation Type</label>
                <select name="transportation" value={formData.transportation} onChange={handleChange}>
                  <option value="Flight">Flight</option>
                  <option value="Train">Train</option>
                  <option value="Bus">Bus</option>
                  <option value="Car">Car</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="predict-button">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Predicting...
                </>
              ) : (
                'Predict Travel Costs'
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
          <div className="prediction-results">
            <h2>Estimated Travel Costs</h2>
            <div className="cost-cards">
              <div className="cost-card accommodation">
                <h3>Accommodation</h3>
                <p className="cost">${prediction.accommodation_cost}</p>
                <p className="cost-label">for your entire stay</p>
              </div>
              
              <div className="cost-card transportation">
                <h3>Transportation</h3>
                <p className="cost">${prediction.transportation_cost}</p>
                <p className="cost-label">round trip</p>
              </div>
              
              <div className="cost-card total">
                <h3>Total Estimated Cost</h3>
                <p className="cost">
                  ${(parseFloat(prediction.accommodation_cost) + parseFloat(prediction.transportation_cost)).toFixed(2)}
                </p>
                <p className="cost-label">for your trip</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Travel Cost Prediction Model v1.0</p>
      </footer>
    </div>
  );
}

export default App;