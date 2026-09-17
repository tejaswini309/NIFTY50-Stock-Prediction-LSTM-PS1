import numpy as np


def prepare_sequences(
    df,
    feature_columns,
    target_column="Target",
    sequence_length=60
):

    X = []
    y = []
    stock_labels = []

    # Process each stock separately
    for stock in df["Stock"].unique():

        stock_data = df[
            df["Stock"] == stock
        ].sort_values("Date").reset_index(drop=True)

        feature_data = stock_data[feature_columns].values
        target_data = stock_data[target_column].values

        for i in range(sequence_length, len(stock_data)):

            X.append(
                feature_data[
                    i - sequence_length:i
                ]
            )

            y.append(
                target_data[i]
            )

            stock_labels.append(stock)

    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.float32)
    stock_labels = np.array(stock_labels)

    print("=" * 50)
    print("SEQUENCE PREPARATION COMPLETED")
    print("=" * 50)
    print("X Shape :", X.shape)
    print("y Shape :", y.shape)
    print("Stock Labels Shape :", stock_labels.shape)

    return X, y, stock_labels