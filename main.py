from src.train_model import train_model
from src.evaluate_model import evaluate_model
from src.data_loader import load_data
from src.preprocessing import perform_eda
from src.stationarity import check_stationarity
from src.scaling import scale_features
from src.train_test_split import split_data
from src.sequence_preparation import prepare_sequences

import pandas as pd


def main():

    data_path = "data/processed/feature_engineered_stock_data.csv"

    # ==========================================================
    # Load Dataset
    # ==========================================================
    df = load_data(data_path)

    # Convert Date column to datetime
    df["Date"] = pd.to_datetime(df["Date"])

    # Sort by Stock and Date
    df = df.sort_values(
        ["Stock", "Date"]
    ).reset_index(drop=True)

    # ==========================================================
    # Basic Checks
    # ==========================================================
    print("=" * 60)
    print("DATASET SHAPE")
    print(df.shape)

    print("\n" + "=" * 60)
    print("FIRST 5 ROWS")
    print(df.head())

    print("\n" + "=" * 60)
    print("LAST 5 ROWS")
    print(df.tail())

    print("\n" + "=" * 60)
    print("DATA TYPES")
    print(df.dtypes)

    print("\n" + "=" * 60)
    print("DATE RANGE")
    print("Start Date :", df["Date"].min())
    print("End Date   :", df["Date"].max())

    print("\n" + "=" * 60)
    print("NUMBER OF STOCKS")
    print(df["Stock"].nunique())

    print("\n" + "=" * 60)
    print("STOCK NAMES")
    print(sorted(df["Stock"].unique()))

    print("\n" + "=" * 60)
    print("DATASET INFO")
    print(df.info())

    print("\n" + "=" * 60)
    print("MISSING VALUES")
    print(df.isnull().sum())

    print("\n" + "=" * 60)
    print("DUPLICATE ROWS")
    print(df.duplicated().sum())

    print("\n" + "=" * 60)
    print("STATISTICAL SUMMARY")
    print(df.describe())

    # ==========================================================
    # EDA
    # ==========================================================
    print("\n" + "=" * 60)
    print("Generating EDA Graphs...")

    perform_eda(df)

    # ==========================================================
    # Stationarity Check
    # ==========================================================
    print("\nChecking Stationarity...\n")

    check_stationarity(
        df,
        column="Target"
    )

    # ==========================================================
    # Scaling
    # ==========================================================
    print("\nScaling Features...\n")

    feature_columns = [
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
        "Close Lag 5",
        "Target",
    ]

    df = scale_features(
        df,
        feature_columns
    )

    print("\nScaling Completed.")
    print(
        "Scaled Dataset Shape :",
        df.shape
    )

    # ==========================================================
    # Train Test Split
    # ==========================================================
    print("\nSplitting Dataset...\n")

    train_df, test_df = split_data(df)

    print("\nTrain/Test Split Completed.")

    # ==========================================================
    # Sequence Preparation
    # ==========================================================
    print("\nPreparing LSTM Sequences...\n")

    # Target is not used as an input feature
    model_feature_columns = [
        column
        for column in feature_columns
        if column != "Target"
    ]

    X_train, y_train, train_stock_labels = prepare_sequences(
        train_df,
        feature_columns=model_feature_columns,
        target_column="Target",
        sequence_length=60
    )

    X_test, y_test, test_stock_labels = prepare_sequences(
        test_df,
        feature_columns=model_feature_columns,
        target_column="Target",
        sequence_length=60
    )

    print("\nSequence Preparation Completed.")
    print("X_train Shape :", X_train.shape)
    print("y_train Shape :", y_train.shape)
    print("X_test Shape  :", X_test.shape)
    print("y_test Shape  :", y_test.shape)

    # ==========================================================
    # LSTM Model Training
    # ==========================================================
    print("\nStarting LSTM Model Training...\n")
    model, history = train_model(
    X_train,
    y_train,
    epochs=20,
    batch_size=64
)
    
    

    print("\nLSTM Training Completed.")

    # ==========================================================
    # Model Evaluation
    # ==========================================================
    print("\nEvaluating Newly Trained LSTM Model...\n")

    predictions, metrics = evaluate_model(
    "models/best_lstm_model.keras",
    "models/scaler/per_stock_scalers.pkl",
    X_test,
    y_test,
    test_stock_labels
)

    print("\nModel Evaluation Completed.")

    # ==========================================================
    # Pipeline Completed
    # ==========================================================
    print("\n" + "=" * 60)
    print("PIPELINE COMPLETED SUCCESSFULLY")
    print("=" * 60)

    print("Training Shape :", train_df.shape)
    print("Testing Shape  :", test_df.shape)

    print("\nEDA Completed.")
    print("Graphs saved in outputs/graphs/")

    print("Train/Test files saved in data/processed/")

    print("LSTM sequences prepared successfully.")

    print("LSTM model training completed.")

    print(
        "Best model saved in "
        "models/best_lstm_model.keras"
    )

    print("\nEvaluation Metrics:")
    print("MAE  :", metrics["MAE"])
    print("MSE  :", metrics["MSE"])
    print("RMSE :", metrics["RMSE"])
    print("R2   :", metrics["R2"])


if __name__ == "__main__":
    main()