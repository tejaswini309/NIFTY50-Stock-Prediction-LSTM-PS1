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