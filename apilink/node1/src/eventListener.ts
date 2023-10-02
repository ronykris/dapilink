import {ethers} from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import dotenv from 'dotenv'
//const { abi } = require('./Apilink.json')
const { abi } = require('../../artifacts/contracts/Apilink.sol/Apilink.json')
//const { abi } = require('../../artifacts/contracts/TestLink.sol/TestLink.json')
dotenv.config()

var nodeKey = process.env.NODE_KEY || ''
var code = process.env.CODE || ''

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = process.env.CONTRACT

const eventListener = () => {
    let wallet = sapphire.wrap(new ethers.Wallet(nodeKey, provider))
    let contract = new ethers.Contract(contractAddr, abi, wallet)
    let contractWithSigner = contract.connect(wallet)
    /*
    contractWithSigner.on('logNode', (x, y) => {
        console.log('Node Success: '+x+','+'Node: '+y)
    })
    contractWithSigner.on('log', (x) => {
        console.log(x)
    })
    
    contractWithSigner.on('logInSuccess', (x) => {
        console.log('Login Success: ',x)
    })
    
    contractWithSigner.on('logInStatus', (x) => {
        console.log('Login Status',x)
    })*/
    contractWithSigner.on('dataCreated', async(x,y) => {
        console.log(x + ' , ' + y)
        let data = await contractWithSigner.getData(wallet.address, y.toNumber())
        console.log(data)
        contractWithSigner.provider.once('block', async() => {
            let data = await contractWithSigner.getData(wallet.address, y.toNumber())
            console.log(data)
        })
        /*
        setTimeout(async () => {
            let data = await contractWithSigner.getData(wallet.address, y.toNumber());
            console.log(data);
        }, 60000); // Wait for approximately 1 minute (adjust this delay based on your network's block time)
        */
    })
    contractWithSigner.on('dataID', async(x,y) => {
        console.log(x + ' , ' + y)
        console.log(wallet.address)        
    })

}

eventListener()

