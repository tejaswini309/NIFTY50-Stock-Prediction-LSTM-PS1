# NIFTY 50 Stock Price Prediction using LSTM

A machine learning and deep learning project for forecasting the next closing price of NIFTY 50 constituent stocks using an LSTM-based time-series model.

The project combines historical stock-market data, feature engineering, time-series preprocessing, LSTM deep learning, model evaluation, FastAPI deployment, and an interactive web application.

---

## Problem Statement 1

### Business Problem

Stock prices are highly dynamic and influenced by historical price movements, trading volume, technical indicators, and market behaviour. Analysing these patterns manually can make it difficult to estimate the potential next closing price of individual NIFTY 50 stocks.

The objective of this project is to develop a data-driven system that uses historical stock information and a trained LSTM model to forecast the next closing price for selected NIFTY 50 stocks.

### Technical Problem

Build a time-series regression model capable of learning sequential patterns from historical stock-market data and predicting the next closing price of a selected NIFTY 50 stock.

The final system accepts a stock name, prepares the latest historical sequence required by the trained model, generates a prediction, and returns the predicted next closing price together with related prediction information.

---

## Project Objective

The main objectives are to:

- Collect and work with historical data for NIFTY 50 constituent stocks.
- Validate and preprocess the available stock-market data.
- Perform exploratory data analysis.
- Apply feature engineering and technical indicators.
- Check time-series modelling prerequisites.
- Scale the input features appropriately.
- Preserve chronological order during train-test splitting.
- Prepare sequential data for LSTM modelling.
- Train an LSTM regression model.
- Evaluate the model using standard regression metrics.
- Tune the model configuration where required.
- Save the trained model and preprocessing artifacts.
- Build a FastAPI backend for prediction.
- Develop an interactive web interface for users.
- Provide a practical prediction workflow for selected NIFTY 50 stocks.

---

## Dataset

The project uses historical stock-market data for NIFTY 50 constituent companies.

The raw stock datasets are stored in:

```text
data/raw/NIFTY50_Datasets/
```

The processed datasets are stored in:

```text
data/processed/
```

Key processed files include:

- `feature_engineered_stock_data.csv`
- `train_data.csv`
- `test_data.csv`

### Data Source

Historical market data was obtained from Yahoo Finance.

---

## Technology Stack

### Programming & Data Processing

- Python
- Pandas
- NumPy
- Scikit-learn

### Machine Learning & Deep Learning

- TensorFlow
- Keras
- LSTM (Long Short-Term Memory)

### Data Analysis & Visualization

- Matplotlib
- Statsmodels

### Backend

- FastAPI
- Uvicorn

### Frontend

- React
- Vite
- Axios
- React Router
- Recharts
- Lucide React

### Model Artifacts

- Keras `.keras` model
- Per-stock `StandardScaler` artifacts

### Development Tools

- Visual Studio Code
- Git
- GitHub

---

## Project Workflow

The project follows a structured end-to-end machine learning workflow:

1. Data Collection
2. Data Validation
3. Data Understanding and Exploratory Data Analysis
4. Business Understanding
5. Problem Definition
6. Missing Value Identification and Handling
7. Stationarity Analysis
8. Feature Engineering
9. Feature Scaling
10. Chronological Train-Test Split
11. Sequence Preparation for LSTM
12. LSTM Model Training
13. Model Evaluation
14. Hyperparameter Tuning
15. Model Saving
16. FastAPI Backend Development
17. Interactive Web Application
18. Prediction and Future Improvement

---

## Model Architecture

The project uses a Long Short-Term Memory (LSTM) neural network for time-series regression.

### Input

The model uses a sequence of the latest **60 time steps** with **26 input features**.

The model features include:

- Adjusted Close
- Close
- High
- Low
- Open
- Volume
- Daily Return
- Price Change
- High-Low Spread
- Open-Close Spread
- Percentage Change
- MA5
- MA10
- MA20
- MA50
- RSI
- MACD
- MACD Signal
- Rolling Std 10
- Rolling Std 20
- Volume MA10
- Volume Change
- Close Lag 1
- Close Lag 2
- Close Lag 3
- Close Lag 5

### LSTM Structure

```text
Input Sequence
     │
     ▼
LSTM Layer — 128 units
     │
     ▼
Dropout — 0.1
     │
     ▼
LSTM Layer — 64 units
     │
     ▼
Dropout — 0.1
     │
     ▼
Dense Layer — 32 units
     │
     ▼
Output Layer — 1 unit
     │
     ▼
Predicted Next Closing Price
```

### Model Configuration

- Optimizer: Adam
- Loss Function: Mean Squared Error (MSE)
- Evaluation Metrics: MAE
- Lookback Window: 60 time steps
- Input Features: 26
- Output: Next closing price

---

## Model Performance

The final LSTM model was evaluated on the chronological test dataset using standard regression metrics.

| Metric | Value |
|---|---:|
| MAE | 192.57 |
| MSE | 219,367.12 |
| RMSE | 468.37 |
| R² Score | 0.9714 |

The evaluation results are based on the final trained model and the held-out test data.

The model and preprocessing artifacts are stored in:

```text
models/
```

Prediction outputs are stored in:

```text
outputs/predictions/
```

---

## API and Web Application

The trained LSTM model is integrated into a FastAPI backend to provide prediction functionality.

### FastAPI Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API information |
| GET | `/health` | Health check |
| POST | `/predict` | Generate the next closing price prediction |

### Prediction Request

The prediction endpoint accepts a stock symbol:

```json
{
  "stock_name": "RELIANCE.NS"
}
```

### API Documentation

Interactive Swagger API documentation is available at:

https://nifty50-stock-prediction-lstm-ps1.onrender.com/docs

### Backend Deployment

The FastAPI backend is deployed using Render.

---

## Interactive Web Application

The project includes an interactive web application that allows users to:

- Select a NIFTY 50 stock.
- Request the next closing price prediction.
- View the latest closing price.
- View the predicted next closing price.
- View expected price change.
- View prediction direction.
- View historical and prediction chart information.
- Store prediction history for authenticated users.

The frontend is built using React and Vite.

---

## Model Prediction Flow

The prediction workflow is:

```text
User Selects Stock
        │
        ▼
Frontend Sends Stock Symbol
        │
        ▼
FastAPI Prediction Endpoint
        │
        ▼
Load Latest Historical Data
        │
        ▼
Prepare Latest 60-Time-Step Sequence
        │
        ▼
Apply Per-Stock Scaling
        │
        ▼
LSTM Model Prediction
        │
        ▼
Inverse Transform Prediction
        │
        ▼
Return Predicted Closing Price
        │
        ▼
Display Result in Web Application
```

---

## Project Structure

```text
NIFTY50-Stock-Prediction-LSTM/
│
├── api/
│   └── app.py
│
├── data/
│   ├── raw/
│   │   └── NIFTY50_Datasets/
│   └── processed/
│       ├── feature_engineered_stock_data.csv
│       ├── train_data.csv
│       └── test_data.csv
│
├── models/
│   ├── best_lstm_model.keras
│   └── scaler/
│       ├── per_stock_scalers.pkl
│       └── standard_scaler.pkl
│
├── notebooks/
│
├── outputs/
│   ├── graphs/
│   ├── predictions/
│   └── training_history.csv
│
├── src/
│   ├── data_loader.py
│   ├── evaluate_model.py
│   ├── evaluate_models.py
│   ├── feature_selection.py
│   ├── hyperparameter.py
│   ├── lstm_preprocessing.py
│   ├── model.py
│   ├── predict.py
│   ├── preprocessing.py
│   ├── scaling.py
│   ├── sequence_preparation.py
│   ├── stationarity.py
│   ├── train_model.py
│   ├── train_models.py
│   ├── train_test_split.py
│   └── utils.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── main.py
├── requirements.txt
├── README.md
├── .gitignore
└── .gitattributes
```

---

## Installation and Usage

### 1. Clone the Repository

```bash
git clone https://github.com/tejaswini309/NIFTY50-Stock-Prediction-LSTM-PS1.git
cd NIFTY50-Stock-Prediction-LSTM-PS1
```

### 2. Create a Python Virtual Environment

```bash
python -m venv .venv
```

Activate the environment on Windows:

```bash
.venv\Scriptsctivate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the FastAPI Backend

```bash
uvicorn api.app:app --reload
```

The local API will be available at:

http://127.0.0.1:8000

Swagger documentation:

http://127.0.0.1:8000/docs

### 5. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will provide the local frontend URL in the terminal.

---

## Deployment

### Backend

The FastAPI backend is deployed on Render.

Production API:

https://nifty50-stock-prediction-lstm-ps1.onrender.com

Swagger documentation:

https://nifty50-stock-prediction-lstm-ps1.onrender.com/docs

### Frontend

The interactive frontend is deployed through Google AI Studio.

Production application:

https://nifty50-stock-prediction-lstm-ps1.ai.studio

---

## Important Model Files

The main trained model is:

```text
models/best_lstm_model.keras
```

The per-stock preprocessing scalers are stored in:

```text
models/scaler/per_stock_scalers.pkl
```

These artifacts are required for prediction using the trained model.

---

## Limitations

- Stock-market prices are influenced by many external factors that are not included in the model.
- The model predicts the next closing price based on historical and engineered features.
- Predictions should be treated as model outputs rather than guaranteed future prices.
- Market behaviour can change over time, which may affect model performance.
- The deployed backend may take additional time to respond after periods of inactivity because of the hosting environment.

---

## Future Improvements

Potential future improvements include:

- Incorporating broader market indicators.
- Adding sentiment and news-based features.
- Including macroeconomic variables.
- Experimenting with GRU, Transformer, and hybrid architectures.
- Performing automated hyperparameter optimization.
- Adding scheduled model retraining.
- Improving monitoring and model drift detection.
- Expanding the prediction workflow with additional forecasting horizons.

---

## Conclusion

This project demonstrates an end-to-end machine learning workflow for NIFTY 50 stock price prediction using LSTM-based time-series regression.

It combines data preprocessing, feature engineering, sequential modelling, model evaluation, API development, deployment, and an interactive frontend into a complete application.
