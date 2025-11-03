import React, { useEffect, useState } from 'react';
// ...existing code...
import CryptoTable from './CryptoTable';

function App() {
  const [search, setSearch] = useState("");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Add coin to watchlist
  const addToWatchlist = (coinId) => {
    if (!watchlist.includes(coinId)) {
      const updated = [...watchlist, coinId];
      setWatchlist(updated);
      localStorage.setItem('watchlist', JSON.stringify(updated));
    }
  };

  // Remove coin from watchlist
  const removeFromWatchlist = (coinId) => {
    const updated = watchlist.filter(id => id !== coinId);
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  useEffect(() => {
    let isMounted = true;
    const fetchPrices = () => {
  fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false')
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            setCoins(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setError('Failed to fetch data.');
            setLoading(false);
          }
        });
    };
    fetchPrices();
  const interval = setInterval(fetchPrices, 60000); // 1 minute
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Filter coins by search
  const filteredCoins = coins.filter(
    coin =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      <h1 className="app-title">Crypto Live Prices Tracker</h1>
      <input
        type="text"
        className="search-input"
        placeholder="Search by name or symbol..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          marginBottom: "18px",
          fontSize: "1rem",
          borderRadius: "4px",
          border: "1px solid #333",
          background: "#181a20",
          color: "#e0e0e0"
        }}
        aria-label="Search coins"
      />
      <div style={{marginBottom: '16px'}}>
        <strong>Watchlist:</strong>
        {watchlist.length === 0 ? (
          <span style={{marginLeft: '8px', color: '#888'}}>No coins added</span>
        ) : (
          <ul style={{display: 'inline', marginLeft: '8px', padding: 0, listStyle: 'none'}}>
            {watchlist.map(id => {
              const coin = coins.find(c => c.id === id);
              return coin ? (
                <li key={id} style={{display: 'inline', marginRight: '12px'}}>
                  {coin.name} <button onClick={() => removeFromWatchlist(id)} style={{fontSize: '0.9em'}}>Remove</button>
                </li>
              ) : null;
            })}
          </ul>
        )}
      </div>
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error-alert">{error}</div>}
      {!loading && !error && (
        <CryptoTable
          coins={filteredCoins}
          onSelect={setSelectedCoin}
          selectedCoin={selectedCoin}
          watchlist={watchlist}
          addToWatchlist={addToWatchlist}
          removeFromWatchlist={removeFromWatchlist}
        />
      )}
    </div>
  );
}

export default App;
