import os
import pandas as pd


def split_data(df, train_size=0.80):

    print("=" * 60)
    print("TRAIN TEST SPLITTING")
    print("=" * 60)

    train_parts = []
    test_parts = []

    # Split each stock separately in chronological order
    for stock in df["Stock"].unique():

        stock_data = df[
            df["Stock"] == stock
        ].sort_values("Date").reset_index(drop=True)

        split_index = int(len(stock_data) * train_size)

        train_stock = stock_data.iloc[:split_index].copy()
        test_stock = stock_data.iloc[split_index:].copy()

        train_parts.append(train_stock)
        test_parts.append(test_stock)

    # Combine all stocks
    train_df = pd.concat(
        train_parts,
        ignore_index=True
    )

    test_df = pd.concat(
        test_parts,
        ignore_index=True
    )

    # Sort the final datasets
    train_df = train_df.sort_values(
        ["Stock", "Date"]
    ).reset_index(drop=True)

    test_df = test_df.sort_values(
        ["Stock", "Date"]
    ).reset_index(drop=True)

    print(f"Training Data : {train_df.shape}")
    print(f"Testing Data  : {test_df.shape}")

    output_path = "data/processed"

    os.makedirs(output_path, exist_ok=True)

    train_df.to_csv(
        os.path.join(
            output_path,
            "train_data.csv"
        ),
        index=False
    )

    test_df.to_csv(
        os.path.join(
            output_path,
            "test_data.csv"
        ),
        index=False
    )

    print("\nTrain and Test datasets saved successfully.")

    return train_df, test_df