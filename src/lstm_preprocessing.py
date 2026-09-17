import os
import numpy as np
import pandas as pd


def create_sequences(df, sequence_length=60):
    """
    Creates LSTM sequences from dataframe.
    """

    feature_columns = [col for col in df.columns if col not in ["Date", "Stock", "Target"]]

    X = []
    y = []

    for stock in df["Stock"].unique():

        stock_df = df[df["Stock"] == stock].reset_index(drop=True)

        features = stock_df[feature_columns].values
        target = stock_df["Target"].values

        for i in range(sequence_length, len(stock_df)):
            X.append(features[i-sequence_length:i])
            y.append(target[i])

    return np.array(X), np.array(y)


def prepare_lstm_data():

    print("=" * 60)
    print("LSTM PREPROCESSING")
    print("=" * 60)

    train_path = "data/processed/train_data.csv"
    test_path = "data/processed/test_data.csv"

    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)

    X_train, y_train = create_sequences(train_df)
    X_test, y_test = create_sequences(test_df)

    os.makedirs("data/lstm", exist_ok=True)

    np.save("data/lstm/X_train.npy", X_train)
    np.save("data/lstm/y_train.npy", y_train)

    np.save("data/lstm/X_test.npy", X_test)
    np.save("data/lstm/y_test.npy", y_test)

    print("X_train :", X_train.shape)
    print("y_train :", y_train.shape)

    print("X_test  :", X_test.shape)
    print("y_test  :", y_test.shape)

    print("\nLSTM datasets saved successfully.")


if __name__ == "__main__":
    prepare_lstm_data()