from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load your trained model
model = joblib.load('improved_multi_cost_predictor.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from POST request
        data = request.json
        
        # Convert to DataFrame with same structure as training data
        input_data = pd.DataFrame([{
            'Destination': data['destination'],
            'Duration (days)': float(data['duration']),
            'Traveler age': float(data['age']),
            'Traveler gender': data['gender'],
            'Traveler nationality': data['nationality'],
            'Accommodation type': data['accommodation'],
            'Transportation type': data['transportation'],
            'Duration_Group': 'medium',  # Will be calculated properly in real app
            'Age_Group': 'adult'         # Will be calculated properly in real app
        }])
        
        # Make prediction
        prediction = model.predict(input_data)
        
        # Return results
        return jsonify({
            'accommodation_cost': round(float(prediction[0][0]), 2),
            'transportation_cost': round(float(prediction[0][1]), 2)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)