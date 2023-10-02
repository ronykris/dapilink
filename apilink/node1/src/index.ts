import {ethers} from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import dotenv from 'dotenv'

const { abi } = require('../../artifacts/contracts/Apilink.sol/Apilink.json')
dotenv.config()

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = process.env.CONTRACT

var nodeKey = process.env.NODE_KEY || ''
var code = process.env.CODE || ''

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
                let isLoggedInTx = await contractWithSigner.isLoggedIn(code)
                console.log('Is logged in tx: ', isLoggedInTx)                
                contractWithSigner.on('logInStatus', async(isLoggedIn) => {
                    if (isLoggedIn === true) {
                        let apiSpec = await contractWithSigner.getApiSpec(id)
                        console.log('API Spec', apiSpec)                        
                    }
                })                
            }       
        }   
    }) 
}

invoke()
