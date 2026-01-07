import React, { useState, useEffect } from 'react';
import { Ticket, Trophy, Wallet, Plus, Clock, Users, Coins, Sparkles } from 'lucide-react';
import cblLogo from './assets/cbl-logo.jpg'; // import novog logoa

export default function CBLRaffleDApp() {
  // ... sve ostalo ostaje isto

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <img src={cblLogo} alt="CBL Logo" className="w-12 h-12 rounded-full shadow-xl" />
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

        {/* Dalje sve ostale sekcije su **isto kao u originalu**, sa istom amber/slate/žutom šemom */}
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
              {/* ... ostatak sekcije ista boja */}
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

            {/* Stats i Raffles Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* ... isti amber/slate stil */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ... ostatak grid sekcije */}
            </div>
          </>
        )}

        {/* Modali */}
        {showTokenModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-amber-700/50">
              {/* ... ostalo isto */}
            </div>
          </div>
        )}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-amber-700/50">
              {/* ... ostalo isto */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
