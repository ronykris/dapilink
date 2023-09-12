import { ethers }from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
const { abi } = require('./Apilink.json')

let provider = sapphire.wrap(new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev"))
let contractAddr = '0x5086B891fFf929591d6914b25E9145FfE7bC207f'
let contract = new ethers.Contract(contractAddr, abi, provider)

var pvtKey = process.env.CLIENT_KEY || ''


const invokeApi = async (apiSpec: string) => {
    let wallet = new ethers.Wallet(pvtKey, provider)
    let contractWithSigner = contract.connect(wallet)
    const tx = await contractWithSigner.setApiSpec(apiSpec)
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

invokeApi('Nothing to see here')
  

  