from statsmodels.tsa.stattools import adfuller


def check_stationarity(df, column="Target"):
    """
    Performs Augmented Dickey-Fuller (ADF) Test
    """

    print("=" * 60)
    print(f"ADF Stationarity Test for '{column}'")
    print("=" * 60)

    result = adfuller(df[column].dropna())

    print(f"ADF Statistic : {result[0]:.6f}")
    print(f"P-value       : {result[1]:.6f}")
    print(f"Lags Used     : {result[2]}")
    print(f"Observations  : {result[3]}")

    print("\nCritical Values")

    for key, value in result[4].items():
        print(f"{key}: {value:.6f}")

    print("\nResult")

    if result[1] <= 0.05:
        print("Dataset is Stationary.")
    else:
        print("Dataset is NOT Stationary.")