import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container">
        <section style={{ padding: "80px 0" }}>
          <p style={{ color: "var(--accent-light)", fontWeight: 600 }}>
            NIFTY 50 STOCK INTELLIGENCE
          </p>

          <h1 style={{ fontSize: "48px", margin: "12px 0" }}>
            Predict the next market move.
          </h1>

          <p
            style={{
              maxWidth: "620px",
              color: "var(--text-secondary)",
              fontSize: "18px",
              lineHeight: 1.7,
            }}
          >
            Explore LSTM-based next closing price predictions for NIFTY 50
            stocks through a simple and interactive dashboard.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;