"use client"

import React, { useState } from 'react';

export default function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [showConnectButton, setShowConnectButton] = useState(true);
  const [walletAddress, setWalletAddress] = useState(null);

  const shinyTextStyles = {
    fontSize: '7rem',
    fontWeight: '800',
    color: "#2b2859", 
    textAlign: 'center',
  };

  const searchBarStyles = {
    width: showSearch ? '66.67%' : '0', // 2/3 of the screen width when visible
  };

  const handleConnectWalletClick = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const selectedAddress = accounts[0];

        if (selectedAddress) {
          setWalletAddress(selectedAddress);
          setShowSearch(true);
          setShowConnectButton(false);
          console.log(selectedAddress)
        } else {
          alert('No wallet address is available.');
        }
      } else {
        alert('Metamask is not installed or not detected.');
      }
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
    }
  };

  const handleLogoutClick = () => {
    setShowSearch(false);
    setShowConnectButton(true); 
    setWalletAddress(null);
    console.log("logged out")
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
      {showSearch && (
        <div style={searchBarStyles} className="mt-4 flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="border-2 border-black-400 rounded py-2 px-4 outline-none w-full"
          />
          <button
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded"
          >
            Search
          </button>
        </div>
      )}
      {showSearch && (
        <div className="mt-4 flex items-center">
          <button
            onClick={handleLogoutClick}
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
