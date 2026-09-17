import os
import joblib
import numpy as np
import pandas as pd

from tensorflow.keras.models import load_model


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

# Target was included when the scaler was fitted
SCALER_COLUMNS = FEATURE_COLUMNS + ["Target"]


def predict_next_price(stock_name):

    print("=" * 60)
    print("NEXT STOCK PRICE PREDICTION")
    print("=" * 60)

    # ==========================================================
    # Load Dataset
    # ==========================================================

    df = pd.read_csv(DATA_PATH)

    df["Date"] = pd.to_datetime(df["Date"])

    stock_data = df[
        df["Stock"] == stock_name
    ].sort_values("Date").reset_index(drop=True)

    if stock_data.empty:

        print("\nStock not found:", stock_name)
        print("Please enter a valid stock name.")

        return None

    if len(stock_data) < 60:

        print("\nNot enough data for prediction.")
        print("At least 60 observations are required.")

        return None

    # ==========================================================
    # Load Model
    # ==========================================================

    print("\nLoading trained LSTM model...")

    model = load_model(MODEL_PATH)

    # ==========================================================
    # Load Per-Stock Scalers
    # ==========================================================

    print("Loading stock scaler...")

    scalers = joblib.load(SCALER_PATH)

    if stock_name not in scalers:

        print("\nScaler not found for:", stock_name)

        return None

    scaler = scalers[stock_name]

    # ==========================================================
    # Select Latest 60 Observations
    # ==========================================================

    latest_data = stock_data[
        FEATURE_COLUMNS
    ].tail(60).copy()

    # ==========================================================
    # Handle Invalid Values
    # ==========================================================

    latest_data = latest_data.replace(
        [np.inf, -np.inf],
        np.nan
    )

    latest_data = latest_data.fillna(
        latest_data.mean()
    )

    # ==========================================================
    # Add Target Column
    # ==========================================================
    #
    # The scaler was fitted using the 26 features + Target.
    # Target is not used by the LSTM as an input feature.
    #
    # We add a temporary Target column only so that the
    # scaler receives the same columns it saw during fitting.

    latest_data["Target"] = stock_data[
        "Target"
    ].tail(60).values

    # Make sure column order exactly matches scaler
    latest_data = latest_data[
        SCALER_COLUMNS
    ]

    # ==========================================================
    # Scale Data
    # ==========================================================

    scaled_full_data = scaler.transform(
        latest_data
    )

    # Remove Target before sending data to LSTM
    target_index = SCALER_COLUMNS.index("Target")

    feature_indices = [
        index
        for index in range(len(SCALER_COLUMNS))
        if index != target_index
    ]

    scaled_data = scaled_full_data[
        :, feature_indices
    ]

    # ==========================================================
    # Prepare LSTM Input
    # ==========================================================

    X_input = scaled_data.reshape(
        1,
        60,
        len(FEATURE_COLUMNS)
    )

    # ==========================================================
    # Generate Prediction
    # ==========================================================

    print("\nGenerating prediction...")

    prediction_scaled = model.predict(
        X_input,
        verbose=0
    )[0][0]

    # ==========================================================
    # Convert Prediction Back to Original Price
    # ==========================================================

    target_mean = scaler.mean_[target_index]
    target_scale = scaler.scale_[target_index]

    predicted_price = (
        prediction_scaled * target_scale
        + target_mean
    )

    # ==========================================================
    # Get Latest Price Information
    # ==========================================================

    latest_date = stock_data[
        "Date"
    ].iloc[-1]

    latest_close = stock_data[
        "Close"
    ].iloc[-1]

    # ==========================================================
    # Calculate Expected Change
    # ==========================================================

    change = predicted_price - latest_close

    percentage_change = (
        change / latest_close
    ) * 100

    # ==========================================================
    # Display Prediction
    # ==========================================================

    print("\n" + "=" * 60)
    print("PREDICTION RESULT")
    print("=" * 60)

    print("Stock :", stock_name)

    print(
        "Latest Date :",
        latest_date.date()
    )

    print(
        f"Latest Close : {latest_close:.2f}"
    )

    print(
        f"Predicted Next Price : "
        f"{predicted_price:.2f}"
    )

    print(
        f"Expected Change : "
        f"{change:.2f}"
    )

    print(
        f"Expected Change (%) : "
        f"{percentage_change:.2f}%"
    )

    if predicted_price > latest_close:

        print(
            "Prediction Direction : UP"
        )

    elif predicted_price < latest_close:

        print(
            "Prediction Direction : DOWN"
        )

    else:

        print(
            "Prediction Direction : NO CHANGE"
        )

    # ==========================================================
    # Save Prediction
    # ==========================================================

    output_path = "outputs/predictions"

    os.makedirs(
        output_path,
        exist_ok=True
    )

    prediction_data = pd.DataFrame(
        {
            "Stock": [stock_name],
            "Latest Date": [latest_date],
            "Latest Close": [latest_close],
            "Predicted Next Price": [predicted_price],
            "Expected Change": [change],
            "Expected Change (%)": [
                percentage_change
            ]
        }
    )

    prediction_file = os.path.join(
        output_path,
        "next_price_prediction.csv"
    )

    prediction_data.to_csv(
        prediction_file,
        index=False
    )

    print("\nPrediction saved at:")
    print(prediction_file)

    print("=" * 60)

    return predicted_price


# ==============================================================
# Main
# ==============================================================

if __name__ == "__main__":

    stock = input(
        "Enter stock name: "
    ).strip()

    predict_next_price(stock)