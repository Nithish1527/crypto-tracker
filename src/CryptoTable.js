import React, { useState } from 'react';

function CryptoTable({ coins, onSelect, selectedCoin, watchlist = [], addToWatchlist, removeFromWatchlist }) {
  const [sortOrder, setSortOrder] = useState('desc');
  // Sorting logic for 24h Change
  const sortedCoins = [...coins].sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.price_change_percentage_24h - a.price_change_percentage_24h;
    } else {
      return a.price_change_percentage_24h - b.price_change_percentage_24h;
    }
  });

  // Sort click handler
  const handleSortClick = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };
  return (
    <div className="crypto-table-container">
      <table className="crypto-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price (USD)</th>
            <th style={{ cursor: 'pointer' }} onClick={handleSortClick} aria-label="Sort by 24h Change">
              24h Change {sortOrder === 'desc' ? '▼' : '▲'}
            </th>
            <th style={{ textAlign: 'center' }}>Watchlist</th>
          </tr>
        </thead>
        <tbody>
          {sortedCoins.map((coin) => (
            <tr
              key={coin.id}
              className={selectedCoin && selectedCoin.id === coin.id ? 'selected' : ''}
              onClick={() => onSelect(coin)}
              tabIndex={0}
              aria-label={`Select ${coin.name}`}
              style={{ cursor: 'pointer' }}
            >
              <td>
                {coin.image && <img src={coin.image} alt={coin.name} width={24} height={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />}
                {coin.name}
              </td>
              <td style={{ textAlign: 'right' }}>${coin.current_price.toLocaleString()}</td>
              <td
                style={{ textAlign: 'right', color: coin.price_change_percentage_24h > 0 ? '#00ff00' : '#ff4d4d', fontFamily: 'monospace' }}
                data-change={coin.price_change_percentage_24h >= 0 ? 'up' : 'down'}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td style={{ textAlign: 'center' }}>
                {watchlist.includes(coin.id) ? (
                  <button onClick={e => { e.stopPropagation(); removeFromWatchlist(coin.id); }} aria-label={`Remove ${coin.name} from watchlist`}>
                    Remove
                  </button>
                ) : (
                  <button onClick={e => { e.stopPropagation(); addToWatchlist(coin.id); }} aria-label={`Add ${coin.name} to watchlist`}>
                    Add
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CryptoTable;
