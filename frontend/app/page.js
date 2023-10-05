"use client"

import React, { useState } from 'react';
import { ethers } from 'ethers';
import * as sapphire from '@oasisprotocol/sapphire-paratime';
import dotenv from 'dotenv'
import {abi} from '../Apilink.json'
//import { spawnSync } from 'child_process';
dotenv.config()

const contractAddr = process.env.NEXT_PUBLIC_CONTRACT
console.log(contractAddr)
//const { abi } = require('../pages/api/Apilink.json')

export default function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [showConnectButton, setShowConnectButton] = useState(true);
  const [walletAddress, setWalletAddress] = useState(null);
  const [searchText, setSearchText] = useState('');

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




  const handleSearchClick  = async() => {
    console.log(`Search Text: ${searchText}`);   
    console.log('loading...')
    
    
    //setTimeout(() => {window.location.href = url}, 15000)
    
    console.log(contractAddr)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = sapphire.wrap(provider.getSigner())    
    const contractWithSigner = new ethers.Contract(contractAddr, abi, signer)

    //backend interaction
    let endpoint = 'https://serpapi.com/search.json?engine=google'
    let APIKEY = process.env.NEXT_PUBLIC_API_KEY || ''
  
    var overrides = {
      value: ethers.utils.parseEther('0.01')
    }
  
    const retrieveFromIpfs = async (cid) => {  
      const execute = spawnSync('ipfs', ['cat', '--api', `/ip4/${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/tcp/8080`, `${cid}`], {encoding: 'utf8'})
      if (execute.error) {
        throw new Error("execution error: " + execute.error.message)
      }
      if (execute.stderr) {
        throw new Error("execution error: " + execute.stderr.toString())
      }
      try {
        const jsonData = JSON.parse(execute.stdout.trim())
        console.log(jsonData)
        return jsonData
      } catch (e) {
        console.error(e)
        return null
      }  
    }
  
  const invokeApi = async (callId, endpoint, method, body, headers) => {        
      console.log(`CallID: ${callId}; endpoint: ${endpoint}; method: ${method}; body: ${body}; headers: ${headers}`)
      const tx = await contractWithSigner.createApiCall(callId, endpoint, method, body, headers, overrides)
      console.log(tx)     
      
      const isTxnMined = async (txnHash) => {
        const txnreceipt = await provider.getTransactionReceipt(txnHash)
        if (txnreceipt) {
          if (txnreceipt.blockNumber) {
            console.log('Txn Block: ', txnreceipt.blockNumber)
            console.log('Txn: ', txnreceipt)
  
            contractWithSigner.on('resultsRcvd', async(rcvd) => {
              if (rcvd) {
              
                contractWithSigner.provider.once('block', async () => {
                  const cid = await contractWithSigner.getResults(callId)
                  console.log(cid)                     
                  return cid             
                })
                
              }
            })
          }
        }
        else {
          console.log('waiting....')
          setTimeout(() => { isTxnMined(txnHash), 500})
        }
      }
      isTxnMined(tx.hash)
  }  
    let endpointParams = `${endpoint}&q=${searchText}&api_key=${APIKEY}`    
    let epoch = Date.now()
    let callId = parseInt(epoch+searchText)
    console.log(callId)
  
    try {
      const cid = await invokeApi(callId,endpointParams, 'GET', '', '')
      if (cid !== undefined|'') {
        const url = `/result/${cid}`
        window.location.href = url
      }       
    } catch (e) {
        console.error(e)      
    }
    //backend interaction
  }    
  

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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            onClick={handleSearchClick}
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
