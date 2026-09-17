import os
import joblib
import numpy as np
from sklearn.preprocessing import StandardScaler


SCALER_PATH = "models/scaler"
os.makedirs(SCALER_PATH, exist_ok=True)


def scale_features(df, feature_columns, train_size=0.80):

    print("=" * 60)
    print("PER-STOCK FEATURE SCALING")
    print("=" * 60)

    df = df.copy()

    # Replace infinite values with NaN
    df[feature_columns] = df[feature_columns].replace(
        [np.inf, -np.inf],
        np.nan
    )

    stock_scalers = {}

    # Process every stock separately
    for stock in df["Stock"].unique():

        stock_mask = df["Stock"] == stock

        stock_data = df.loc[
            stock_mask
        ].sort_values("Date").copy()

        split_index = int(
            len(stock_data) * train_size
        )

        train_data = stock_data.iloc[
            :split_index
        ]

        # Calculate missing-value replacement
        # using training data only
        train_means = train_data[
            feature_columns
        ].mean()

        df.loc[
            stock_mask,
            feature_columns
        ] = df.loc[
            stock_mask,
            feature_columns
        ].fillna(train_means)

        # Create a scaler for this stock
        scaler = StandardScaler()

        scaler.fit(
            df.loc[
                train_data.index,
                feature_columns
            ]
        )

        # Transform this stock using
        # its own training statistics
        df.loc[
            stock_mask,
            feature_columns
        ] = scaler.transform(
            df.loc[
                stock_mask,
                feature_columns
            ]
        )

        stock_scalers[stock] = scaler

    # Save all stock-specific scalers
    scaler_file = os.path.join(
        SCALER_PATH,
        "per_stock_scalers.pkl"
    )

    joblib.dump(
        stock_scalers,
        scaler_file
    )

    print("\nScaling completed successfully.")
    print(
        "Number of stock scalers:",
        len(stock_scalers)
    )

    print(
        "Each scaler was fitted using "
        "training data only."
    )

    print(
        "Scalers saved at:",
        scaler_file
    )

    return df