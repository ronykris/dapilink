import { ethers }from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import dotenv from 'dotenv'
import { spawnSync } from "child_process";


//const { abi } = require('../../artifacts/contracts/Apilink.sol/Apilink.json')
const { abi } = require('./Apilink.json')
dotenv.config()

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = process.env.CONTRACT


var pvtKey = process.env.CLIENT_KEY || ''
var overrides = {
  value: ethers.utils.parseEther('0.01')
}

const retrieveFromIpfs = async (cid: string): Promise<object | null> => {
  const cmd = `ipfs cat /ipfs/${cid}`
  const execute = spawnSync('ipfs', ['cat', `/ipfs/${cid}`], {encoding: 'utf8'})
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

          contractWithSigner.on('resultsRcvd', async(rcvd: boolean) => {
            if (rcvd) {
              contractWithSigner.provider.once('block', async () => {
                const cid: string = await contractWithSigner.getResults(callId)
                const results = await retrieveFromIpfs(cid)
                console.log(results)                
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

export default invokeApi ;  

  