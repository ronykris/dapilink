import {ethers} from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = '0xF4216590273fbfcb19a016d24AD8f20038e742fA'

var nodeKey = process.env.NODE_KEY || ''
var code = process.env.CODE || ''

const invoke = async () => {
    let wallet = sapphire.wrap(new ethers.Wallet(nodeKey, provider))
    let contract = new ethers.Contract(contractAddr, abi, wallet)
    let contractWithSigner = contract.connect(wallet)

    contractWithSigner.on('invoked', async(status, id) => {
        console.log(status + ',' + id)
        if (status === true) {        
            let node = await contractWithSigner.getChosenNode()
            console.log(node._hex)
            console.log(process.env.NODEID)
            if ( node._hex === process.env.NODEID ) {
                let isLoggedIn = await contractWithSigner.isLoggedIn(code)
                console.log('Is logged in: ', isLoggedIn)
                if ( isLoggedIn ) { 
                    let apiSpec = await contractWithSigner.getApiSpec(wallet.address, id)
                    console.log('API Spec', apiSpec)
                }
            }       
        }   
    })     
}

invoke()
