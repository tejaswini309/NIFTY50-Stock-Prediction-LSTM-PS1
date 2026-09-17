import os
import numpy as np
import matplotlib.pyplot as plt

from sklearn.metrics import mean_absolute_error
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score
from tensorflow.keras.models import load_model
import joblib


def evaluate_model(
    model_path,
    scaler_path,
    X_test,
    y_test,
    stock_labels
):

    print("=" * 60)
    print("MODEL EVALUATION")
    print("=" * 60)

    # ==========================================================
    # Load Trained Model
    # ==========================================================

    model = load_model(model_path)

    # Load per-stock scalers
    stock_scalers = joblib.load(scaler_path)

    print(
        "\nLoaded scalers for",
        len(stock_scalers),
        "stocks."
    )

    print("\nGenerating predictions...")

    predictions = model.predict(
        X_test,
        verbose=1
    )

    predictions = predictions.flatten()
    y_test = np.asarray(y_test).flatten()
    stock_labels = np.asarray(stock_labels)

    # ==========================================================
    # Convert Predictions Back to Original Prices
    # ==========================================================

    predictions_original = np.zeros(
        len(predictions)
    )

    y_test_original = np.zeros(
        len(y_test)
    )

    for stock in np.unique(stock_labels):

        stock_mask = (
            stock_labels == stock
        )

        scaler = stock_scalers[stock]

        # Target is the last column in feature_columns
        target_mean = scaler.mean_[-1]
        target_scale = scaler.scale_[-1]

        predictions_original[stock_mask] = (
            predictions[stock_mask]
            * target_scale
            + target_mean
        )

        y_test_original[stock_mask] = (
            y_test[stock_mask]
            * target_scale
            + target_mean
        )

    # ==========================================================
    # Calculate Evaluation Metrics
    # ==========================================================

    mae = mean_absolute_error(
        y_test_original,
        predictions_original
    )

    mse = mean_squared_error(
        y_test_original,
        predictions_original
    )

    rmse = np.sqrt(mse)

    r2 = r2_score(
        y_test_original,
        predictions_original
    )

    print("\n" + "=" * 60)
    print("EVALUATION RESULTS")
    print("=" * 60)

    print(f"MAE  : {mae:.4f}")
    print(f"MSE  : {mse:.4f}")
    print(f"RMSE : {rmse:.4f}")
    print(f"R2   : {r2:.4f}")

    # ==========================================================
    # Save Predictions
    # ==========================================================

    output_path = "outputs/predictions"

    os.makedirs(
        output_path,
        exist_ok=True
    )

    prediction_file = os.path.join(
        output_path,
        "actual_vs_predicted.csv"
    )

    prediction_data = np.column_stack(
        (
            stock_labels,
            y_test_original,
            predictions_original
        )
    )

    np.savetxt(
        prediction_file,
        prediction_data,
        delimiter=",",
        header="Stock,Actual,Predicted",
        comments="",
        fmt="%s"
    )

    # ==========================================================
    # Prediction Graph
    # ==========================================================

    graph_path = "outputs/graphs"

    os.makedirs(
        graph_path,
        exist_ok=True
    )

    plt.figure(figsize=(12, 6))

    plt.plot(
        y_test_original[:500],
        label="Actual"
    )

    plt.plot(
        predictions_original[:500],
        label="Predicted"
    )

    plt.title(
        "Actual vs Predicted Stock Prices"
    )

    plt.xlabel("Time")
    plt.ylabel("Stock Price")

    plt.legend()

    plt.tight_layout()

    graph_file = os.path.join(
        graph_path,
        "actual_vs_predicted.png"
    )

    plt.savefig(graph_file)

    plt.close()

    print("\nPrediction file saved at:")
    print(prediction_file)

    print("\nPrediction graph saved at:")
    print(graph_file)

    return predictions_original, {
        "MAE": mae,
        "MSE": mse,
        "RMSE": rmse,
        "R2": r2
    }