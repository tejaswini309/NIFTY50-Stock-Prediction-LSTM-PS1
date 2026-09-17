import os
import joblib
import numpy as np
import pandas as pd

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from tensorflow.keras.models import load_model


app = FastAPI(
    title="NIFTY 50 Stock Prediction API",
    description="LSTM based next stock price prediction API",
    version="1.0.0"
)


MODEL_PATH = "models/best_lstm_model.keras"
SCALER_PATH = "models/scaler/per_stock_scalers.pkl"
DATA_PATH = "data/processed/feature_engineered_stock_data.csv"


FEATURE_COLUMNS = [
    "Adj Close",
    "Close",
    "High",
    "Low",
    "Open",
    "Volume",
    "Daily Return",
    "Price Change",
    "High-Low Spread",
    "Open-Close Spread",
    "Percentage Change",
    "MA5",
    "MA10",
    "MA20",
    "MA50",
    "RSI",
    "MACD",
    "MACD Signal",
    "Rolling Std 10",
    "Rolling Std 20",
    "Volume MA10",
    "Volume Change",
    "Close Lag 1",
    "Close Lag 2",
    "Close Lag 3",
    "Close Lag 5"
]

SCALER_COLUMNS = FEATURE_COLUMNS + ["Target"]

SEQUENCE_LENGTH = 60


model = None
scalers = None


try:
    model = load_model(MODEL_PATH)

    scalers = joblib.load(
        SCALER_PATH
    )

    print("Model loaded successfully.")
    print("Scalers loaded successfully.")

except Exception as error:
    print("Error loading model or scalers:")
    print(error)


class StockPredictionRequest(BaseModel):
    stock_name: str


@app.get("/")
def home():

    return {
        "message": "NIFTY 50 Stock Prediction API is running",
        "status": "success"
    }


@app.get("/health")
def health():

    if model is None or scalers is None:

        return {
            "status": "unhealthy",
            "model_loaded": False,
            "scalers_loaded": False
        }

    return {
        "status": "healthy",
        "model_loaded": True,
        "scalers_loaded": True
    }


@app.post("/predict")
def predict_stock(data: StockPredictionRequest):

    if model is None or scalers is None:

        raise HTTPException(
            status_code=500,
            detail="Model or scalers are not loaded."
        )

    stock_name = data.stock_name.strip()

    if not os.path.exists(DATA_PATH):

        raise HTTPException(
            status_code=500,
            detail="Feature engineered dataset not found."
        )

    df = pd.read_csv(DATA_PATH)

    df["Date"] = pd.to_datetime(
        df["Date"]
    )

    stock_data = df[
        df["Stock"] == stock_name
    ].sort_values(
        "Date"
    ).reset_index(drop=True)

    if stock_data.empty:

        raise HTTPException(
            status_code=404,
            detail=f"Stock '{stock_name}' not found."
        )

    if stock_name not in scalers:

        raise HTTPException(
            status_code=404,
            detail=f"No scaler found for stock '{stock_name}'."
        )

    if len(stock_data) < SEQUENCE_LENGTH:

        raise HTTPException(
            status_code=400,
            detail="Not enough historical data for prediction."
        )

    latest_data = stock_data[
        FEATURE_COLUMNS
    ].tail(
        SEQUENCE_LENGTH
    ).copy()

    latest_data = latest_data.replace(
        [np.inf, -np.inf],
        np.nan
    )

    latest_data = latest_data.fillna(
        latest_data.mean()
    )

    # The scaler was fitted using the 26 features plus Target.
    # Target is included here only for scaling and is removed
    # before sending the data to the LSTM model.

    latest_data["Target"] = stock_data[
        "Target"
    ].tail(
        SEQUENCE_LENGTH
    ).values

    latest_data = latest_data[
        SCALER_COLUMNS
    ]

    scaler = scalers[stock_name]

    scaled_full_data = scaler.transform(
        latest_data
    )

    target_index = SCALER_COLUMNS.index(
        "Target"
    )

    feature_indices = [
        index
        for index in range(
            len(SCALER_COLUMNS)
        )
        if index != target_index
    ]

    scaled_data = scaled_full_data[
        :,
        feature_indices
    ]

    X_input = scaled_data.reshape(
        1,
        SEQUENCE_LENGTH,
        len(FEATURE_COLUMNS)
    )

    prediction_scaled = model.predict(
        X_input,
        verbose=0
    )[0][0]

    target_mean = scaler.mean_[
        target_index
    ]

    target_scale = scaler.scale_[
        target_index
    ]

    predicted_price = (
        prediction_scaled * target_scale
        + target_mean
    )

    latest_date = stock_data[
        "Date"
    ].iloc[-1]

    latest_close = stock_data[
        "Close"
    ].iloc[-1]

    change = (
        predicted_price
        - latest_close
    )

    percentage_change = (
        change / latest_close
    ) * 100

    if predicted_price > latest_close:

        direction = "UP"

    elif predicted_price < latest_close:

        direction = "DOWN"

    else:

        direction = "NO CHANGE"

    return {
        "stock": stock_name,
        "latest_date": str(
            latest_date.date()
        ),
        "latest_close": round(
            float(latest_close),
            2
        ),
        "predicted_next_price": round(
            float(predicted_price),
            2
        ),
        "expected_change": round(
            float(change),
            2
        ),
        "expected_change_percent": round(
            float(percentage_change),
            2
        ),
        "prediction_direction": direction
    }