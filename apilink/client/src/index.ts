import { ethers }from 'ethers'

const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider()
let contractAddr = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
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

invokeApi('Hello World!')
  

  