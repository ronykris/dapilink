import { ethers }from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import dotenv from 'dotenv'
//const { abi } = require('../../artifacts/contracts/TestLink.sol/TestLink.json')
const { abi } = require('../../artifacts/contracts/Apilink.sol/Apilink.json')
dotenv.config()

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = process.env.CONTRACT


var pvtKey = process.env.CLIENT_KEY || ''
var overrides = {
  gasPrice: ethers.utils.parseUnits('100', 'gwei'), // Set your desired gas price (in Gwei)
  gasLimit: 200000, // Set your desired gas limit
  value: ethers.utils.parseEther('0.01')
}

const setData = async (callId: number, eValue: string, mValue: string) => {    
    let wallet = sapphire.wrap(new ethers.Wallet(pvtKey, provider))
    let contract = new ethers.Contract(contractAddr, abi, wallet)
    let contractWithSigner = contract.connect(wallet)
    console.log(`CallID: ${callId}; eValue: ${eValue}; mValue: ${mValue}`)
    const tx = await contractWithSigner.setData(callId, eValue, mValue, overrides)
    console.log(tx)     
    
    const isTxnMined = async (txnHash: string) => {
      const txnreceipt: any = await provider.getTransactionReceipt(txnHash)
      if (txnreceipt) {
        if (txnreceipt.blockNumber) {
          console.log('Txn Block: ', txnreceipt.blockNumber)
          console.log('Txn: ', txnreceipt)
        }
      }
      else {
        console.log('waiting....')
        setTimeout(() => { isTxnMined(txnHash), 500})
      }
    }
    isTxnMined(tx.hash)
}

setData(123456, "eTest", "mTest") ;  

  