import React, { useState } from 'react';
import { Ticket, Trophy, Wallet, Plus, Clock, Users, Coins } from 'lucide-react';
import Logo from './assets/cbl-logo.jpg';

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
    if (!newToken.symbol || !newToken.mintAddress) return alert('Please fill in all token details');
    if (newToken.symbol in balances || customTokens.find(t => t.symbol === newToken.symbol))
      return alert('Token symbol already exists');

    const token = {
      symbol: newToken.symbol.toUpperCase(),
      mintAddress: newToken.mintAddress,
      decimals: parseInt(newToken.decimals)
    };

    setCustomTokens([...customTokens, token]);
    setBalances({ ...balances, [token.symbol]: 0 });
    setShowTokenModal(false);
    setNewToken({ symbol: '', mintAddress: '', decimals: '9' });
    alert(`Token ${token.symbol} added!`);
  };

  const createRaffle = () => {
    if (!newRaffle.title || !newRaffle.prizePool || !newRaffle.ticketPrice || !newRaffle.totalTickets) return alert('Fill all fields');
    const prizePool = parseFloat(newRaffle.prizePool);
    const currentBalance = balances[newRaffle.token];
    if (prizePool > currentBalance) return alert(`Insufficient ${newRaffle.token} balance`);

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
    if (ticketPrice > balances[token]) return alert(`Insufficient ${token} balance`);
    setBalances({ ...balances, [token]: balances[token] - ticketPrice });
    setMyTickets({ ...myTickets, [raffleId]: (myTickets[raffleId] || 0) + 1 });

    setRaffles(raffles.map(r => {
      if (r.id === raffleId) return { ...r, soldTickets: r.soldTickets + 1, participants: myTickets[raffleId] ? r.participants : r.participants + 1 };
      return r;
    }));
  };

  const endRaffle = (raffleId) => {
    const raffle = raffles.find(r => r.id === raffleId);
    if (raffle.soldTickets === 0) return alert('No tickets sold');

    const winnerTicket = Math.floor(Math.random() * raffle.soldTickets) + 1;
    const hasWon = myTickets[raffleId] >= winnerTicket;
    if (hasWon) {
      setBalances({ ...balances, [raffle.token]: balances[raffle.token] + raffle.prizePool });
      alert(`🎉 You won ${raffle.prizePool} ${raffle.token}!`);
    } else {
      alert(`Raffle ended. Ticket #${winnerTicket} won ${raffle.prizePool} ${raffle.token}`);
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
  const filteredRaffles = selectedToken === 'ALL' ? raffles : raffles.filter(r => r.token === selectedToken);

  const getTokenColor = (token) => {
    const colors = {
      CBL: 'text-brand-blue',
      SOL: 'text-brand-purple',
      USDC: 'text-brand-white'
    };
    return colors[token] || 'text-brand-white';
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl shadow-glow">
              <img src={Logo} alt="CBL Logo" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-brand-blue">CBL Raffle 2026</h1>
              <p className="text-brand-purple text-sm font-semibold">Crypto Bar Lounge · Powered by Solana</p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {connected && (
              <>
                <button
                  onClick={() => setShowTokenModal(true)}
                  className="flex items-center gap-2 bg-brand-blue hover:bg-brand-purple px-4 py-2 rounded-lg font-semibold shadow-glow transition"
                >
                  <Coins className="w-5 h-5" />
                  Add Token
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-brand-purple hover:bg-brand-blue px-4 py-2 rounded-lg font-semibold shadow-glow transition"
                >
                  <Plus className="w-5 h-5" />
                  Create Raffle
                </button>
              </>
            )}
            <button
              onClick={connected ? disconnectWallet : connectWallet}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition shadow-glow ${
                connected ? 'bg-brand-purple hover:bg-brand-blue' : 'bg-brand-blue hover:bg-brand-purple'
              }`}
            >
              <Wallet className="w-5 h-5" />
              {connected ? walletAddress : 'Connect Wallet'}
            </button>
          </div>
        </div>

        {/* Connected / Not Connected */}
        {!connected ? (
          <div className="text-center py-20">
            <div className="bg-brand-surface/90 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-brand-blue shadow-glow">
              <Trophy className="w-20 h-20 mx-auto mb-6 text-brand-blue" />
              <h2 className="text-2xl font-bold mb-4">Welcome to CBL Raffle 2026</h2>
              <p className="text-brand-purple mb-2 font-semibold">Crypto Bar Lounge</p>
              <p className="text-brand-white/80 mb-6">
                Connect your Solana wallet to participate in CBL token raffles
              </p>
              <button
                onClick={connectWallet}
                className="bg-brand-blue hover:bg-brand-purple px-8 py-3 rounded-lg font-semibold transition w-full shadow-glow"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        ) : (
          <>

  {/* Token Balances */}
  <div className="bg-brand-surface/90 backdrop-blur-sm rounded-xl p-6 mb-6 border border-brand-blue/50 shadow-glow">
    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
      <Wallet className="w-5 h-5 text-brand-blue" />
      Your Token Balances
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-brand-blue/50 to-brand-purple/30 rounded-lg p-4 border border-brand-blue/30">
        <div className="text-brand-purple text-sm mb-1 font-semibold">CBL</div>
        <div className="text-2xl font-bold font-mono text-brand-blue">
          {balances.CBL.toLocaleString()}
        </div>
        <div className="text-xs text-brand-purple mt-1">Crypto Bar Lounge</div>
      </div>
      {Object.entries(balances)
        .filter(([token]) => token !== 'CBL')
        .map(([token, balance]) => (
          <div key={token} className="bg-brand-dark/50 rounded-lg p-4 border border-brand-purple/30">
            <div className="text-brand-white text-sm mb-1">{token}</div>
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
          ? 'bg-brand-blue shadow-glow'
          : 'bg-brand-surface/50 hover:bg-brand-dark border border-brand-blue/50'
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
            ? token === 'CBL'
              ? 'bg-brand-blue shadow-glow'
              : 'bg-brand-purple shadow-glow'
            : 'bg-brand-surface/50 hover:bg-brand-dark border border-brand-blue/50'
        }`}
      >
        {token}
      </button>
    ))}
  </div>

  {/* Stats */}
  <div className="grid grid-cols-3 gap-4 mb-8">
    <div className="bg-brand-surface/90 backdrop-blur-sm rounded-xl p-4 border border-brand-blue/30 shadow-glow">
      <div className="text-brand-purple text-sm mb-1">Active Raffles</div>
      <div className="text-2xl font-bold text-brand-blue">{filteredRaffles.filter(r => r.status === 'active').length}</div>
    </div>
    <div className="bg-brand-surface/90 backdrop-blur-sm rounded-xl p-4 border border-brand-blue/30 shadow-glow">
      <div className="text-brand-purple text-sm mb-1">My Tickets</div>
      <div className="text-2xl font-bold text-brand-blue">{Object.values(myTickets).reduce((a, b) => a + b, 0)}</div>
    </div>
    <div className="bg-brand-surface/90 backdrop-blur-sm rounded-xl p-4 border border-brand-blue/30 shadow-glow">
      <div className="text-brand-purple text-sm mb-1">Tokens Supported</div>
      <div className="text-2xl font-bold text-brand-blue">{allTokens.length}</div>
    </div>
  </div>

  {/* Raffles Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {filteredRaffles.map(raffle => (
      <div key={raffle.id} className="bg-brand-surface/90 backdrop-blur-sm rounded-xl p-6 border border-brand-blue/50 shadow-glow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">{raffle.title}</h3>
            <p className="text-brand-white/70 text-sm font-mono">by {raffle.creator}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              raffle.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
            }`}>
              {raffle.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              raffle.token === 'CBL' ? 'bg-gradient-to-r from-brand-blue to-brand-purple text-white' : `${getTokenColor(raffle.token)} bg-brand-dark`
            }`}>
              {raffle.token}
            </span>
          </div>
        </div>

        <div className="bg-brand-dark/70 rounded-lg p-4 mb-4 border border-brand-purple/30">
          <div className="flex justify-between mb-2">
            <span className="text-brand-white/70">Prize Pool</span>
            <span className={`font-bold ${raffle.token === 'CBL' ? 'text-brand-blue' : getTokenColor(raffle.token)}`}>
              {raffle.prizePool.toLocaleString()} {raffle.token}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-brand-white/70">Ticket Price</span>
            <span className="font-mono text-brand-white">{raffle.ticketPrice.toLocaleString()} {raffle.token}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-white/70">Tickets Sold</span>
            <span className="text-brand-white">{raffle.soldTickets} / {raffle.totalTickets}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-brand-white/70">Progress</span>
            <span className="text-brand-white">{Math.round((raffle.soldTickets / raffle.totalTickets) * 100)}%</span>
          </div>
          <div className="w-full bg-brand-dark rounded-full h-2">
            <div 
              className={`${raffle.token === 'CBL' ? 'bg-gradient-to-r from-brand-blue to-brand-purple' : 'bg-gradient-to-r from-brand-purple to-brand-blue'} h-2 rounded-full transition-all`}
              style={{ width: `${(raffle.soldTickets / raffle.totalTickets) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-1 text-brand-white/70">
            <Clock className="w-4 h-4" />
            {formatTime(raffle.endTime)}
          </div>
          <div className="flex items-center gap-1 text-brand-white/70">
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
              className={`flex-1 ${raffle.token === 'CBL' ? 'bg-gradient-to-r from-brand-blue to-brand-purple hover:from-brand-purple hover:to-brand-blue' : 'bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-blue hover:to-brand-purple'} disabled:from-gray-600 disabled:to-gray-600 px-4 py-2 rounded-lg font-semibold transition shadow-glow`}
            >
              Buy Ticket
            </button>
            {raffle.creator === walletAddress && (
              <button
                onClick={() => endRaffle(raffle.id)}
                className="bg-gradient-to-r from-brand-blue to-brand-purple hover:from-brand-purple hover:to-brand-blue px-4 py-2 rounded-lg font-semibold transition shadow-glow"
              >
                Draw Winner
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-2 text-brand-white/70">
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
    <div className="bg-brand-surface rounded-2xl p-6 max-w-md w-full border border-brand-blue/50 shadow-glow">
      <h2 className="text-2xl font-bold mb-4 text-brand-white">Add Custom Token</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-brand-purple mb-2">Token Symbol</label>
          <input
            type="text"
            value={newToken.symbol}
            onChange={(e) => setNewToken({ ...newToken, symbol: e.target.value })}
            className="w-full bg-brand-dark border border-brand-blue/50 rounded-lg px-4 py-2 text-brand-white uppercase"
            placeholder="MYTOKEN"
          />
        </div>

        <div>
          <label className="block text-sm text-brand-purple mb-2">Mint Address</label>
          <input
            type="text"
            value={newToken.mintAddress}
            onChange={(e) => setNewToken({ ...newToken, mintAddress: e.target.value })}
            className="w-full bg-brand-dark border border-brand-blue/50 rounded-lg px-4 py-2 text-brand-white font-mono text-sm"
            placeholder="7xKX...9mPq"
          />
          <p className="text-xs text-brand-white/50 mt-1">Enter the SPL token mint address</p>
        </div>

        <div>
          <label className="block text-sm text-brand-purple mb-2">Decimals</label>
          <input
            type="number"
            value={newToken.decimals}
            onChange={(e) => setNewToken({ ...newToken, decimals: e.target.value })}
            className="w-full bg-brand-dark border border-brand-blue/50 rounded-lg px-4 py-2 text-brand-white"
            placeholder="9"
          />
          <p className="text-xs text-brand-white/50 mt-1">Usually 9 for most SPL tokens</p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowTokenModal(false)}
          className="flex-1 bg-brand-dark/80 hover:bg-brand-dark px-4 py-2 rounded-lg font-semibold text-brand-white transition"
        >
          Cancel
        </button>
        <button
          onClick={addCustomToken}
          className="flex-1 bg-gradient-to-r from-brand-blue to-brand-purple hover:from-brand-purple hover:to-brand-blue px-4 py-2 rounded-lg font-semibold text-brand-white transition shadow-glow"
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
    <div className="bg-brand-surface rounded-2xl p-6 max-w-md w-full border border-brand-blue/50 shadow-glow">
      <h2 className="text-2xl font-bold mb-4 text-brand-white">Create New Raffle</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-brand-purple mb-2">Raffle Title</label>
          <input
            type="text"
            value={newRaffle.title}
            onChange={(e) => setNewRaffle({ ...newRaffle, title: e.target.value })}
            className="w-full bg-brand-dark border border-brand-blue/50 rounded-lg px-4 py-2 text-brand-white"
            placeholder="My Awesome Raffle"
          />
        </div>

        <div>
          <label className="block text-sm text-brand-purple mb-2">Token</label>
          <select
            value={newRaffle.token}
            onChange={(e) => setNewRaffle({ ...newRaffle, token: e.target.value })}
            className="w-full bg-brand-dark border border-brand-blue/50 rounded-lg px-4 py-2 text-brand-white"
          >
            {allTokens.map(token => (
              <option key={token} value={token}>
                {token} {token === 'CBL' ? '(Crypto Bar Lounge)' : ''} - Balance: {balances[token]?.toLocaleString() || 0}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-brand-purple mb-2">Prize Pool ({newRaffle.token})</label>
          <input
            type="number"
            step="0.1"
            value={newRaffle.prizePool}
            onChange={(e) => setNewRaffle({ ...newRaffle, prizePool: e.target.value })}
            className="w-full bg-brand-dark border border-brand-blue/50 rounded-lg px-4 py-2 text-brand-white"
            placeholder="1000"
          />
        </div>

        <div>
          <label className="block text-sm text-brand-purple mb-2">Ticket Price ({newRaffle.token})</label>
          <input
            type="number"
            step="0.01"
            value={newRaffle.ticketPrice}
            onChange={(e) => setNewRaffle({ ...newRaffle, ticketPrice: e.target.value })}
            className="w-full bg-brand-dark border border-brand-blue/50 rounded-lg px-4 py-2 text-brand-white"
            placeholder="50"
          />
        </div>

        <div>
          <label className="block text-sm text-brand-purple mb-2">Total Tickets</label>
          <input
            type="number"
            value={newRaffle.totalTickets}
            onChange={(e) => setNewRaffle({ ...newRaffle, totalTickets: e.target.value })}
            className="w-full bg-brand-dark border border-brand-blue/50 rounded-lg px-4 py-2 text-brand-white"
            placeholder="100"
          />
        </div>

        <div>
          <label className="block text-sm text-brand-purple mb-2">Duration (hours)</label>
          <select
            value={newRaffle.duration}
            onChange={(e) => setNewRaffle({ ...newRaffle, duration: e.target.value })}
            className="w-full bg-brand-dark border border-brand-blue/50 rounded-lg px-4 py-2 text-brand-white"
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
          className="flex-1 bg-brand-dark/80 hover:bg-brand-dark px-4 py-2 rounded-lg font-semibold text-brand-white transition"
        >
          Cancel
        </button>
        <button
          onClick={createRaffle}
          className="flex-1 bg-gradient-to-r from-brand-blue to-brand-purple hover:from-brand-purple hover:to-brand-blue px-4 py-2 rounded-lg font-semibold text-brand-white transition shadow-glow"
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