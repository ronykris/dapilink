import  invokeApi from './index'
import dotenv from 'dotenv'
import { ethers }from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import { spawnSync } from "child_process";

const { abi } = require('./Apilink.json')
dotenv.config()

let epoch = Date.now()
let callId = parseInt(epoch+text)
console.log(callId)

let endpoint = 'https://serpapi.com/search.json?engine=google'
let APIKEY = process.env.API_KEY || ''

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = process.env.CONTRACT

var pvtKey = process.env.CLIENT_KEY || ''
var overrides = {
  value: ethers.utils.parseEther('0.01')
}

const retrieveFromIpfs = async (cid) => {  
  const execute = spawnSync('ipfs', ['cat', '--api', '/ip4/35.200.178.102/tcp/8080', `${cid}`], {encoding: 'utf8'})
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
    let wallet = sapphire.wrap(new ethers.Wallet(pvtKey, provider))
    let contract = new ethers.Contract(contractAddr, abi, wallet)
    let contractWithSigner = contract.connect(wallet)
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
                const results = await retrieveFromIpfs(cid)
                console.log(results)   
                return results             
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


const invoke = async(callId, endpoint, method, body, headers) => {      
    return await invokeApi(callId, endpoint, method, body, headers)
}

export default async function handler(req, res) {
    const query = req.query.q
    let endpointParams = `${endpoint}&q=${query}&api_key=${APIKEY}`    
    try {
      const searchResult = await invoke(callId,endpointParams, 'GET', '', '')
      res.status(200).json(searchResult);
    } catch (e) {
      console.error(e)
      res.status(400).json(e.message)
    }
    
}