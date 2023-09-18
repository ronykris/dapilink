import {ethers} from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = '0x6C462036d8CfE3a4935D7f4694aAE0b746406db7'

var nodeKey = process.env.NODE_KEY || ''
var code = process.env.CODE || ''

const invoke = async () => {
    let wallet = sapphire.wrap(new ethers.Wallet(nodeKey, provider))
    let contract = new ethers.Contract(contractAddr, abi, wallet)
    let contractWithSigner = contract.connect(wallet)


    contractWithSigner.on('invoked', async(status, id) => {
        console.log(status + ',' + id)
        if (status) {        
            let node = await contractWithSigner.getChosenNode()
            if ( node === process.env.NODE ) {
                let isLoggedIn = await contractWithSigner.isLoggedIn(code)
                if ( isLoggedIn ) { 
                    let apiSpec = await contractWithSigner.getApiSpec(wallet.address, id)
                    console.log('API Spec', apiSpec)
                }
            }        
        }     
    })
}

invoke()
