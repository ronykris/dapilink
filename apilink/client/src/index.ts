import { ethers }from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import dotenv from 'dotenv'

const { abi } = require('../../artifacts/contracts/Apilink.sol/Apilink.json')
dotenv.config()

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = process.env.CONTRACT


var pvtKey = process.env.CLIENT_KEY || ''
var overrides = {
  value: ethers.utils.parseEther('0.01')
}

const invokeApi = async (callId: number, endpoint: string, method: string, body: string, headers:string) => {    
    let wallet = sapphire.wrap(new ethers.Wallet(pvtKey, provider))
    let contract = new ethers.Contract(contractAddr, abi, wallet)
    let contractWithSigner = contract.connect(wallet)
    console.log(`CallID: ${callId}; endpoint: ${endpoint}; method: ${method}; body: ${body}; headers: ${headers}`)
    const tx = await contractWithSigner.createApiCall(callId, endpoint, method, body, headers, overrides)
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

export default invokeApi ;  

  