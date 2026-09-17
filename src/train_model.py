import os
import pandas as pd
import matplotlib.pyplot as plt

from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from src.model import build_lstm_model


def train_model(X_train, y_train, epochs=20, batch_size=64):

    print("=" * 60)
    print("LSTM MODEL TRAINING")
    print("=" * 60)

    input_shape = (
        X_train.shape[1],
        X_train.shape[2]
    )

    model = build_lstm_model(input_shape)

    os.makedirs("models", exist_ok=True)
    os.makedirs("outputs/graphs", exist_ok=True)
    os.makedirs("outputs", exist_ok=True)

    model_path = "models/best_lstm_model.keras"

    callbacks = [
        EarlyStopping(
            monitor="val_loss",
            patience=5,
            restore_best_weights=True
        ),
        ModelCheckpoint(
            model_path,
            monitor="val_loss",
            save_best_only=True
        )
    ]

    history = model.fit(
        X_train,
        y_train,
        epochs=epochs,
        batch_size=batch_size,
        validation_split=0.1,
        shuffle=False,
        callbacks=callbacks
    )

    # ==========================================================
    # Save Training History
    # ==========================================================

    history_data = pd.DataFrame(
        history.history
    )

    history_data.to_csv(
        "outputs/training_history.csv",
        index=False
    )

    # ==========================================================
    # Training vs Validation Loss Graph
    # ==========================================================

    plt.figure(figsize=(10, 6))

    plt.plot(
        history.history["loss"],
        label="Training Loss"
    )

    plt.plot(
        history.history["val_loss"],
        label="Validation Loss"
    )

    plt.title(
        "LSTM Training and Validation Loss"
    )

    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.legend()

    plt.tight_layout()

    plt.savefig(
        "outputs/graphs/training_validation_loss.png"
    )

    plt.close()

    print("\nTraining completed.")

    print(
        "Best model saved at:",
        model_path
    )

    print(
        "Training history saved at:",
        "outputs/training_history.csv"
    )

    print(
        "Training graph saved at:",
        "outputs/graphs/training_validation_loss.png"
    )

    return model, history