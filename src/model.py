from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout


def build_lstm_model(input_shape):
    """
    Builds the LSTM model.

    Parameters
    ----------
    input_shape : tuple
        Shape of input (timesteps, features)

    Returns
    -------
    model : keras.Model
        Compiled LSTM model
    """

    model = Sequential()

    # First LSTM Layer
    model.add(
        LSTM(
            units=128,
            return_sequences=True,
            input_shape=input_shape
        )
    )

    model.add(
        Dropout(0.1)
    )

    # Second LSTM Layer
    model.add(
        LSTM(
            units=64,
            return_sequences=False
        )
    )

    model.add(
        Dropout(0.1)
    )

    # Dense Layer
    model.add(
        Dense(
            32,
            activation="relu"
        )
    )

    # Output Layer
    model.add(
        Dense(1)
    )

    # Compile Model
    model.compile(
        optimizer="adam",
        loss="mse",
        metrics=["mae"]
    )

    print("=" * 60)
    print("LSTM MODEL CREATED")
    print("=" * 60)

    model.summary()

    return model