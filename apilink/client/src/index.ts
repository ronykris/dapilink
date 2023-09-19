import { ethers }from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = '0xF4216590273fbfcb19a016d24AD8f20038e742fA'


var pvtKey = process.env.CLIENT_KEY || ''
var overrides = {
  value: ethers.utils.parseEther('0.01')
}

interface apiSpec {
  callid: string,
  endpoint: string,
  method: string,
  body?: string,
  headers?: string
}

const invokeApi = async (api: apiSpec) => {    
    let wallet = sapphire.wrap(new ethers.Wallet(pvtKey, provider))
    let contract = new ethers.Contract(contractAddr, abi, wallet)
    let contractWithSigner = contract.connect(wallet)
    const tx = await contractWithSigner.createApiCall(api.callid, api.endpoint, api.method, api.body, api.headers, overrides)
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

  