import { ethers }from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = '0x6C462036d8CfE3a4935D7f4694aAE0b746406db7'


var pvtKey = process.env.CLIENT_KEY || ''
var overrides = {
  value: ethers.utils.parseEther('0.01')
}

const invokeApi = async (apiSpec: string) => {    
    let wallet = sapphire.wrap(new ethers.Wallet(pvtKey, provider))
    let contract = new ethers.Contract(contractAddr, abi, wallet)
    let contractWithSigner = contract.connect(wallet)
    const tx = await contractWithSigner.createApiCall(apiSpec, overrides)
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

invokeApi('Tomorrow never dies!')
  

  