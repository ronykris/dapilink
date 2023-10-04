"use client"

import React, { useState } from 'react';

export default function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [showConnectButton, setShowConnectButton] = useState(true);

  const shinyTextStyles = {
    fontSize: '7rem',
    fontWeight: '800',
    color: "#2b2859", 
    textAlign: 'center',
  };

  const searchBarStyles = {
    display: showSearch ? 'block' : 'none',
  };

  const handleConnectWalletClick = () => {
    setShowSearch(true);
    setShowConnectButton(false); // Hide the "Connect Wallet" button
  };

  const handleLogoutClick = () => {
    setShowSearch(false);
    setShowConnectButton(true); // Show the "Connect Wallet" button again
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <div className='mt-40'>
        <p style={shinyTextStyles}>
          <span className="text-purple-900"></span>DSearch
        </p>
      </div>
      {showConnectButton && (
        <button
          onClick={handleConnectWalletClick}
          className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      )}
      <div style={searchBarStyles} className="mt-4 flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-l py-2 px-4 outline-none"
        />
        <button
          onClick={handleLogoutClick}
          className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
