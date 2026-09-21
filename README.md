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

### Data Source
- Yahoo Finance historical market data

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

The actual-versus-predicted results are available in:

```text
outputs/predictions/actual_vs_predicted.csv


---

## API and Web Application

The trained LSTM model is integrated into a FastAPI backend to provide prediction functionality.

### FastAPI Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API information |
| GET | `/health` | Health check |
| POST | `/predict` | Generate the next closing price prediction |

The prediction endpoint accepts a stock symbol:

```json
{
  "stock_name": "RELIANCE.NS"
}

---

## Installation and Usage

### 1. Clone the Repository

```bash
git clone https://github.com/tejaswini309/NIFTY50-Stock-Prediction-LSTM-PS1.git
cd NIFTY50-Stock-Prediction-LSTM-PS1