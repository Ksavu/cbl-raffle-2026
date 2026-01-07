import React, { useState } from 'react';
import {
  Ticket,
  Trophy,
  Wallet,
  Plus,
  Clock,
  Users,
  Coins
} from 'lucide-react';

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

  const [customTokens, setCustomTokens] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<Record<number, number>>({});
  const [selectedToken, setSelectedToken] = useState('ALL');

  const connectWallet = () => {
    const mock =
      '7xKX' +
      Math.random().toString(36).substring(2, 6) +
      '...' +
      Math.random().toString(36).substring(2, 6);
    setWalletAddress(mock);
    setConnected(true);
  };

  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress('');
  };

  const allTokens = ['CBL', 'SOL', 'USDC', ...customTokens.map(t => t.symbol)];

  const getTokenColor = (token: string) => {
    if (token === 'CBL') return 'text-cyan-400';
    if (token === 'SOL') return 'text-purple-400';
    if (token === 'USDC') return 'text-blue-400';
    return 'text-slate-300';
  };

  const formatTime = (ts: number) => {
    const diff = ts - Date.now();
    if (diff <= 0) return 'Ended';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  const filteredRaffles =
    selectedToken === 'ALL'
      ? raffles
      : raffles.filter(r => r.token === selectedToken);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050B2E] via-[#0E1A4F] to-black text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <img
              src={Logo}
              alt="CBL Logo"
              className="w-12 h-12 rounded-full shadow-[0_0_30px_rgba(22,224,255,0.6)]"
            />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#16E0FF] to-[#C23BFF] bg-clip-text text-transparent">
                CBL Raffle 2026
              </h1>
              <p className="text-cyan-300 text-sm font-semibold">
                Crypto Bar Lounge · Solana Powered
              </p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {connected && (
              <>
                <button
                  onClick={() => setShowTokenModal(true)}
                  className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg shadow"
                >
                  <Coins className="inline w-4 h-4 mr-1" />
                  Add Token
                </button>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-[#16E0FF] to-[#C23BFF] px-4 py-2 rounded-lg font-semibold shadow-[0_0_20px_rgba(22,224,255,0.35)]"
                >
                  <Plus className="inline w-4 h-4 mr-1" />
                  Create Raffle
                </button>
              </>
            )}

            <button
              onClick={connected ? disconnectWallet : connectWallet}
              className="bg-gradient-to-r from-[#16E0FF] to-[#C23BFF] px-6 py-2 rounded-lg font-semibold shadow-[0_0_25px_rgba(22,224,255,0.45)] hover:scale-105 transition"
            >
              <Wallet className="inline w-4 h-4 mr-1" />
              {connected ? walletAddress : 'Connect Wallet'}
            </button>
          </div>
        </div>

        {!connected ? (
          <div className="text-center py-20">
            <div className="bg-slate-900/80 rounded-2xl p-12 max-w-md mx-auto border border-cyan-500/30 shadow-[0_0_40px_rgba(22,224,255,0.25)]">
              <Trophy className="w-20 h-20 mx-auto mb-6 text-cyan-400" />
              <h2 className="text-2xl font-bold mb-3">
                Welcome to CBL Raffle
              </h2>
              <p className="text-slate-300 mb-6">
                Connect your Solana wallet and participate in CBL raffles
              </p>
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-[#16E0FF] to-[#C23BFF] px-8 py-3 rounded-lg font-semibold w-full shadow-[0_0_25px_rgba(22,224,255,0.45)]"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* BALANCES */}
            <div className="bg-slate-900/80 rounded-xl p-6 mb-6 border border-cyan-500/30 shadow-xl">
              <h3 className="text-lg font-bold mb-4">
                Your Token Balances
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(balances).map(([token, balance]) => (
                  <div
                    key={token}
                    className="bg-[#050B2E] rounded-lg p-4 border border-cyan-400/20"
                  >
                    <div className="text-sm text-slate-300">{token}</div>
                    <div
                      className={`text-2xl font-bold ${getTokenColor(token)}`}
                    >
                      {balance.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FILTER */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {['ALL', ...allTokens].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedToken(t)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    selectedToken === t
                      ? 'bg-gradient-to-r from-[#16E0FF] to-[#C23BFF]'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* RAFFLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRaffles.map(r => (
                <div
                  key={r.id}
                  className="bg-slate-900/80 rounded-xl p-6 border border-cyan-500/30 shadow-xl"
                >
                  <h3 className="text-xl font-bold mb-2">{r.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    by {r.creator}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Prize</span>
                      <span className="text-cyan-400 font-bold">
                        {r.prizePool} {r.token}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ticket</span>
                      <span>
                        {r.ticketPrice} {r.token}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sold</span>
                      <span>
                        {r.soldTickets}/{r.totalTickets}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between text-sm text-slate-300">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(r.endTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {r.participants}
                    </div>
                  </div>

                  <button className="mt-4 w-full bg-gradient-to-r from-[#16E0FF] to-[#C23BFF] py-2 rounded-lg font-semibold shadow">
                    Buy Ticket
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
