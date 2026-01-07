import React, { useState, useEffect } from 'react';
import { Ticket, Trophy, Wallet, Plus, Clock, Users, Coins, Sparkles } from 'lucide-react';

export default function CBLRaffleDApp() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balances, setBalances] = useState({
    SOL: 2.5,
    CBL: 5000,
    USDC: 100
  });
  const [raffles, setRaffles] = useState([
    {
      id: 1,
      title: 'Grand Opening Celebration',
      prizePool: 1000,
      ticketPrice: 50,
      totalTickets: 100,
      soldTickets: 67,
      endTime: Date.now() + 3600000,
      creator: '7xKX...9mPq',
      participants: 34,
      status: 'active',
      token: 'CBL'
    },
    {
      id: 2,
      title: 'VIP Lounge Access Raffle',
      prizePool: 2500,
      ticketPrice: 100,
      totalTickets: 50,
      soldTickets: 28,
      endTime: Date.now() + 7200000,
      creator: '4aBC...3nDf',
      participants: 18,
      status: 'active',
      token: 'CBL'
    }
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [newRaffle, setNewRaffle] = useState({
    title: '',
    prizePool: '',
    ticketPrice: '',
    totalTickets: '',
    duration: '1',
    token: 'CBL'
  });
  const [newToken, setNewToken] = useState({
    symbol: '',
    mintAddress: '',
    decimals: '9'
  });
  const [customTokens, setCustomTokens] = useState([]);
  const [myTickets, setMyTickets] = useState({});
  const [selectedToken, setSelectedToken] = useState('ALL');

  const connectWallet = () => {
    const mockAddress = '7xKX' + Math.random().toString(36).substring(2, 6) + '...' + Math.random().toString(36).substring(2, 6);
    setWalletAddress(mockAddress);
    setConnected(true);
  };

  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress('');
  };

  const addCustomToken = () => {
    if (!newToken.symbol || !newToken.mintAddress) {
      alert('Please fill in all token details');
      return;
    }

    if (newToken.symbol in balances || customTokens.find(t => t.symbol === newToken.symbol)) {
      alert('Token symbol already exists');
      return;
    }

    const token = {
      symbol: newToken.symbol.toUpperCase(),
      mintAddress: newToken.mintAddress,
      decimals: parseInt(newToken.decimals)
    };

    setCustomTokens([...customTokens, token]);
    setBalances({ ...balances, [token.symbol]: 0 });
    setShowTokenModal(false);
    setNewToken({ symbol: '', mintAddress: '', decimals: '9' });
    alert(`Token ${token.symbol} added! You can now receive this token.`);
  };

  const createRaffle = () => {
    if (!newRaffle.title || !newRaffle.prizePool || !newRaffle.ticketPrice || !newRaffle.totalTickets) {
      alert('Please fill in all fields');
      return;
    }

    const prizePool = parseFloat(newRaffle.prizePool);
    const currentBalance = balances[newRaffle.token];

    if (prizePool > currentBalance) {
      alert(`Insufficient ${newRaffle.token} balance`);
      return;
    }

    const raffle = {
      id: raffles.length + 1,
      title: newRaffle.title,
      prizePool: prizePool,
      ticketPrice: parseFloat(newRaffle.ticketPrice),
      totalTickets: parseInt(newRaffle.totalTickets),
      soldTickets: 0,
      endTime: Date.now() + (parseInt(newRaffle.duration) * 3600000),
      creator: walletAddress,
      participants: 0,
      status: 'active',
      token: newRaffle.token
    };

    setRaffles([raffle, ...raffles]);
    setBalances({ ...balances, [newRaffle.token]: currentBalance - prizePool });
    setShowCreateModal(false);
    setNewRaffle({ title: '', prizePool: '', ticketPrice: '', totalTickets: '', duration: '1', token: 'CBL' });
  };

  const buyTicket = (raffleId, ticketPrice, token) => {
    const currentBalance = balances[token];
    
    if (ticketPrice > currentBalance) {
      alert(`Insufficient ${token} balance`);
      return;
    }

    setBalances({ ...balances, [token]: currentBalance - ticketPrice });
    setMyTickets({ ...myTickets, [raffleId]: (myTickets[raffleId] || 0) + 1 });
    
    setRaffles(raffles.map(r => {
      if (r.id === raffleId) {
        return {
          ...r,
          soldTickets: r.soldTickets + 1,
          participants: myTickets[raffleId] ? r.participants : r.participants + 1
        };
      }
      return r;
    }));
  };

  const endRaffle = (raffleId) => {
    const raffle = raffles.find(r => r.id === raffleId);
    if (raffle.soldTickets === 0) {
      alert('No tickets sold');
      return;
    }

    const winnerTicket = Math.floor(Math.random() * raffle.soldTickets) + 1;
    const hasWon = myTickets[raffleId] >= winnerTicket;

    if (hasWon) {
      const currentBalance = balances[raffle.token];
      setBalances({ ...balances, [raffle.token]: currentBalance + raffle.prizePool });
      alert(`🎉 Congratulations! You won ${raffle.prizePool.toLocaleString()} ${raffle.token}!`);
    } else {
      alert(`Raffle ended. Ticket #${winnerTicket} won ${raffle.prizePool.toLocaleString()} ${raffle.token}`);
    }

    setRaffles(raffles.map(r => r.id === raffleId ? { ...r, status: 'ended' } : r));
  };

  const formatTime = (timestamp) => {
    const diff = timestamp - Date.now();
    if (diff <= 0) return 'Ended';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const allTokens = ['CBL', 'SOL', 'USDC', ...customTokens.map(t => t.symbol)];
  const filteredRaffles = selectedToken === 'ALL' 
    ? raffles 
    : raffles.filter(r => r.token === selectedToken);

  const getTokenColor = (token) => {
    const colors = {
      CBL: 'text-amber-400',
      SOL: 'text-purple-400',
      USDC: 'text-blue-400'
    };
    return colors[token] || 'text-yellow-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-3 rounded-xl shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                CBL Raffle 2026
              </h1>
              <p className="text-amber-300 text-sm font-semibold">Crypto Bar Lounge · Powered by Solana</p>
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            {connected && (
              <>
                <button
                  onClick={() => setShowTokenModal(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition shadow-lg"
                >
                  <Coins className="w-5 h-5" />
                  Add Token
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create Raffle
                </button>
              </>
            )}
            <button
              onClick={connected ? disconnectWallet : connectWallet}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition shadow-lg ${
                connected 
                  ? 'bg-amber-700 hover:bg-amber-800' 
                  : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700'
              }`}
            >
              <Wallet className="w-5 h-5" />
              {connected ? walletAddress : 'Connect Wallet'}
            </button>
          </div>
        </div>

        {!connected ? (
          <div className="text-center py-20">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-amber-700/50 shadow-2xl">
              <Trophy className="w-20 h-20 mx-auto mb-6 text-amber-400" />
              <h2 className="text-2xl font-bold mb-4">Welcome to CBL Raffle 2026</h2>
              <p className="text-amber-300 mb-2 font-semibold">Crypto Bar Lounge</p>
              <p className="text-slate-300 mb-6">
                Connect your Solana wallet to participate in CBL token raffles
              </p>
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 px-8 py-3 rounded-lg font-semibold transition w-full shadow-lg"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Token Balances */}
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 mb-6 border border-amber-700/50 shadow-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                Your Token Balances
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-amber-900/50 to-yellow-900/30 rounded-lg p-4 border border-amber-700/30">
                  <div className="text-amber-300 text-sm mb-1 font-semibold">CBL</div>
                  <div className="text-2xl font-bold font-mono text-amber-400">
                    {balances.CBL.toLocaleString()}
                  </div>
                  <div className="text-xs text-amber-500 mt-1">Crypto Bar Lounge</div>
                </div>
                {Object.entries(balances).filter(([token]) => token !== 'CBL').map(([token, balance]) => (
                  <div key={token} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div className="text-slate-300 text-sm mb-1">{token}</div>
                    <div className={`text-xl font-bold font-mono ${getTokenColor(token)}`}>
                      {balance.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Token Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setSelectedToken('ALL')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedToken === 'ALL'
                    ? 'bg-amber-600 shadow-lg'
                    : 'bg-slate-800/50 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                All Tokens
              </button>
              {allTokens.map(token => (
                <button
                  key={token}
                  onClick={() => setSelectedToken(token)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedToken === token
                      ? token === 'CBL' ? 'bg-amber-600 shadow-lg' : 'bg-amber-700 shadow-lg'
                      : 'bg-slate-800/50 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {token}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-amber-700/30">
                <div className="text-amber-300 text-sm mb-1">Active Raffles</div>
                <div className="text-2xl font-bold text-amber-400">{filteredRaffles.filter(r => r.status === 'active').length}</div>
              </div>
              <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-amber-700/30">
                <div className="text-amber-300 text-sm mb-1">My Tickets</div>
                <div className="text-2xl font-bold text-amber-400">{Object.values(myTickets).reduce((a, b) => a + b, 0)}</div>
              </div>
              <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-amber-700/30">
                <div className="text-amber-300 text-sm mb-1">Tokens Supported</div>
                <div className="text-2xl font-bold text-amber-400">{allTokens.length}</div>
              </div>
            </div>

            {/* Raffles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRaffles.map(raffle => (
                <div key={raffle.id} className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-amber-700/50 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{raffle.title}</h3>
                      <p className="text-slate-400 text-sm font-mono">by {raffle.creator}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        raffle.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                      }`}>
                        {raffle.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        raffle.token === 'CBL' ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white' : `${getTokenColor(raffle.token)} bg-slate-900`
                      }`}>
                        {raffle.token}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/70 rounded-lg p-4 mb-4 border border-slate-700">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">Prize Pool</span>
                      <span className={`font-bold ${raffle.token === 'CBL' ? 'text-amber-400' : getTokenColor(raffle.token)}`}>
                        {raffle.prizePool.toLocaleString()} {raffle.token}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">Ticket Price</span>
                      <span className="font-mono text-slate-200">{raffle.ticketPrice.toLocaleString()} {raffle.token}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Tickets Sold</span>
                      <span className="text-slate-200">{raffle.soldTickets} / {raffle.totalTickets}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Progress</span>
                      <span className="text-slate-200">{Math.round((raffle.soldTickets / raffle.totalTickets) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div 
                        className={`${raffle.token === 'CBL' ? 'bg-gradient-to-r from-amber-500 to-yellow-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'} h-2 rounded-full transition-all`}
                        style={{ width: `${(raffle.soldTickets / raffle.totalTickets) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-4 h-4" />
                      {formatTime(raffle.endTime)}
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Users className="w-4 h-4" />
                      {raffle.participants} participants
                    </div>
                  </div>

                  {myTickets[raffle.id] && (
                    <div className="bg-green-900/30 border border-green-700 rounded-lg p-2 mb-3 text-sm text-center">
                      You own {myTickets[raffle.id]} ticket{myTickets[raffle.id] > 1 ? 's' : ''}
                    </div>
                  )}

                  {raffle.status === 'active' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => buyTicket(raffle.id, raffle.ticketPrice, raffle.token)}
                        disabled={raffle.soldTickets >= raffle.totalTickets}
                        className={`flex-1 ${raffle.token === 'CBL' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'} disabled:from-gray-600 disabled:to-gray-600 px-4 py-2 rounded-lg font-semibold transition shadow-lg`}
                      >
                        Buy Ticket
                      </button>
                      {raffle.creator === walletAddress && (
                        <button
                          onClick={() => endRaffle(raffle.id)}
                          className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-semibold transition shadow-lg"
                        >
                          Draw Winner
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-2 text-slate-400">
                      Raffle Ended
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Add Token Modal */}
        {showTokenModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-amber-700/50">
              <h2 className="text-2xl font-bold mb-4">Add Custom Token</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-amber-300 mb-2">Token Symbol</label>
                  <input
                    type="text"
                    value={newToken.symbol}
                    onChange={(e) => setNewToken({ ...newToken, symbol: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white uppercase"
                    placeholder="MYTOKEN"
                  />
                </div>

                <div>
                  <label className="block text-sm text-amber-300 mb-2">Mint Address</label>
                  <input
                    type="text"
                    value={newToken.mintAddress}
                    onChange={(e) => setNewToken({ ...newToken, mintAddress: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm"
                    placeholder="7xKX...9mPq"
                  />
                  <p className="text-xs text-slate-400 mt-1">Enter the SPL token mint address</p>
                </div>

                <div>
                  <label className="block text-sm text-amber-300 mb-2">Decimals</label>
                  <input
                    type="number"
                    value={newToken.decimals}
                    onChange={(e) => setNewToken({ ...newToken, decimals: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    placeholder="9"
                  />
                  <p className="text-xs text-slate-400 mt-1">Usually 9 for most SPL tokens</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowTokenModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addCustomToken}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Add Token
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Raffle Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-amber-700/50">
              <h2 className="text-2xl font-bold mb-4">Create New Raffle</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-amber-300 mb-2">Raffle Title</label>
                  <input
                    type="text"
                    value={newRaffle.title}
                    onChange={(e) => setNewRaffle({ ...newRaffle, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    placeholder="My Awesome Raffle"
                  />
                </div>

                <div>
                  <label className="block text-sm text-amber-300 mb-2">Token</label>
                  <select
                    value={newRaffle.token}
                    onChange={(e) => setNewRaffle({ ...newRaffle, token: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  >
                    {allTokens.map(token => (
                      <option key={token} value={token}>
                        {token} {token === 'CBL' ? '(Crypto Bar Lounge)' : ''} - Balance: {balances[token]?.toLocaleString() || 0}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-amber-300 mb-2">Prize Pool ({newRaffle.token})</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRaffle.prizePool}
                    onChange={(e) => setNewRaffle({ ...newRaffle, prizePool: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    placeholder="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-amber-300 mb-2">Ticket Price ({newRaffle.token})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newRaffle.ticketPrice}
                    onChange={(e) => setNewRaffle({ ...newRaffle, ticketPrice: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-amber-300 mb-2">Total Tickets</label>
                  <input
                    type="number"
                    value={newRaffle.totalTickets}
                    onChange={(e) => setNewRaffle({ ...newRaffle, totalTickets: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm text-amber-300 mb-2">Duration (hours)</label>
                  <select
                    value={newRaffle.duration}
                    onChange={(e) => setNewRaffle({ ...newRaffle, duration: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="1">1 hour</option>
                    <option value="6">6 hours</option>
                    <option value="24">24 hours</option>
                    <option value="72">3 days</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={createRaffle}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 px-4 py-2 rounded-lg font-semibold transition shadow-lg"
                >
                  Create Raffle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}