import pandas as pd


def load_data(file_path):
    """
    Load CSV file and return a pandas DataFrame.
    """

    df = pd.read_csv(file_path)

    print("=" * 50)
    print("Dataset Loaded Successfully")
    print("=" * 50)
    print(f"Shape : {df.shape}")

    return df