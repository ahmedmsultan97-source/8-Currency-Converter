import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [amount, setAmount] = useState(1);
  const [fromCur, setFromCur] = useState("EUR");
  const [toCur, setToCur] = useState("USD");
  const [converted, setConverted] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isSame = fromCur === toCur;
  const rate = isSame ? 1 : converted;

  useEffect(
    function () {
      if (isSame) return;

      async function convert() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://api.frankfurter.dev/v2/rate/${fromCur}/${toCur}`,
          );
          if (!res.ok) throw new Error("Rate not available");
          const data = await res.json();
          setConverted(data.rate);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      convert();
    },
    [fromCur, toCur, isSame],
  );
  function handleSwap() {
    setFromCur(toCur);
    setToCur(fromCur);
  }
  return (
    <main className="card">
      <h1>Currency Converter</h1>
      <div className="field">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="text"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        ></input>
      </div>
      <div className="row">
        <select
          value={fromCur}
          onChange={(e) => setFromCur(e.target.value)}
          disabled={isLoading}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
          <option value="EGP">EGP</option>
        </select>
        <button
          className="swap"
          type="button"
          aria-label="Swap currencies"
          onClick={handleSwap}
          disabled={isLoading}
        >
          ⇄
        </button>
        <select
          value={toCur}
          onChange={(e) => setToCur(e.target.value)}
          disabled={isLoading}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
          <option value="EGP">EGP</option>
        </select>
      </div>
      <p>
        {isLoading && !isSame
          ? "Loading..."
          : error && !isSame
            ? error
            : `${rate * amount} ${toCur}`}
      </p>
    </main>
  );
}
