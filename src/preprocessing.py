import os
import matplotlib.pyplot as plt
import seaborn as sns

GRAPH_PATH = "outputs/graphs"

os.makedirs(GRAPH_PATH, exist_ok=True)


def perform_eda(df):

    print("=" * 60)
    print("EDA STARTED")
    print("=" * 60)

    # -----------------------------
    # 1. Close Price Distribution
    # -----------------------------
    plt.figure(figsize=(8,5))
    sns.histplot(df["Close"], bins=50, kde=True)
    plt.title("Close Price Distribution")
    plt.tight_layout()
    plt.savefig(f"{GRAPH_PATH}/close_distribution.png")
    plt.close()

    # -----------------------------
    # 2. Close Price Trend
    # -----------------------------
    sample = df[df["Stock"] == df["Stock"].iloc[0]]

    plt.figure(figsize=(12,5))
    plt.plot(sample["Date"], sample["Close"])
    plt.title(f"Closing Price Trend ({sample['Stock'].iloc[0]})")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(f"{GRAPH_PATH}/closing_price_trend.png")
    plt.close()

    # -----------------------------
    # 3. Correlation Heatmap
    # -----------------------------
    numeric_df = df.select_dtypes(include="number")

    plt.figure(figsize=(14,10))
    sns.heatmap(
        numeric_df.corr(),
        cmap="coolwarm",
        center=0
    )
    plt.title("Correlation Heatmap")
    plt.tight_layout()
    plt.savefig(f"{GRAPH_PATH}/correlation_heatmap.png")
    plt.close()

    print("EDA Graphs Saved Successfully")