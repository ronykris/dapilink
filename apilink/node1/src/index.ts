import {ethers} from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import axios from 'axios'
import dotenv from 'dotenv'
import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";

//const { abi } = require('../../artifacts/contracts/Apilink.sol/Apilink.json')
const { abi } = require('./Apilink.json')
dotenv.config()

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = process.env.CONTRACT

var nodeKey = process.env.NODE_KEY || ''
var code = process.env.CODE || ''

const triggerJob = async (endpoint: string, method: string): Promise<Object> => {
    let config = {
        method: method,
        maxBodyLength: Infinity,
        url: endpoint,
        headers: { 
          'Accept': 'application/json'
        }
    }
    const response = await axios.request(config)
    const results = await response.data
    console.log(results)
    return results
}

const jsonToFile = async (jsonObj: object, id: string): Promise<string> => {    
    const buffer = Buffer.from(JSON.stringify(jsonObj))
    const filePath = `/tmp/ipfs-docker-staging/${id}.json`
    fs.writeFileSync(filePath, buffer)    
    return filePath
}


const uploadToIpfs = async (jsonObj: object, id: string): Promise<string | null> => {
    const cmd = `ipfs add ${await jsonToFile(jsonObj, id)}`
    const execute = spawnSync('ipfs', ['add', `${await jsonToFile(jsonObj, id)}`])
    if (execute.error) {
      throw new Error("execution error: " + execute.error.message)
    }
    if (execute.stderr) {
      throw new Error("execution error: " + execute.stderr.toString())
    }
    const output = execute.stdout.toString()    
    const cidRegex = /\bQm[1-9A-HJ-NP-Za-km-z]{44}\b/
    const cidMatch = output.match(cidRegex);
    if (cidMatch) {
        const cid = cidMatch[0]
        return cid
    } else {
        console.error('Unable to extract CID.')
        return null
    }    
  }

const invoke = async () => {
    let wallet = sapphire.wrap(new ethers.Wallet(nodeKey, provider))
    let contract = new ethers.Contract(contractAddr, abi, wallet)
    let contractWithSigner = contract.connect(wallet)

    contractWithSigner.on('invoked', async(status, id) => {
        console.log(status + ',' + id)
        if (status === true) {        
            let node = await contractWithSigner.getChosenNode(id)
            console.log(node._hex)
            console.log(process.env.NODEID)
            if ( node._hex === process.env.NODEID ) {
                let isLoggedInStatus = await contractWithSigner.isLoggedIn(code)
                //console.log('Is logged in tx: ', isLoggedInTx)                
                //contractWithSigner.on('logInStatus', async(isLoggedIn) => {
                    if (isLoggedInStatus === true) {
                        let apiSpec = await contractWithSigner.getApiSpec(id)
                        console.log('API Spec', apiSpec)  
                        const result = await triggerJob(apiSpec.endpoint, apiSpec.method)
                        const cid = await uploadToIpfs(result, id)
                        if (cid) {
                            const uploadTx = await contractWithSigner.setResult(id, cid)
                            console.log('Upload results tx: ', uploadTx)
                        }
                    }
                //})                
            }       
        }   
    }) 
}

invoke()
