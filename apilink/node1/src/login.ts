import {ethers} from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = '0xF4216590273fbfcb19a016d24AD8f20038e742fA'

var nodeKey = process.env.NODE_KEY || ''
var code = process.env.CODE || ''
/*
var overrides = {
  value: ethers.utils.parseEther('0.01')
}*/

const login = async (code: string, nodeName: string) => {
    if ( !process.env.CODE ) {
        throw new Error('Cannot proceed without code')
    }
    if ( !process.env.NODE_KEY ) {
        throw new Error('Cannot proceed without NODE KEY')
    }
    let wallet = sapphire.wrap(new ethers.Wallet(nodeKey, provider))
    let contract = new ethers.Contract(contractAddr, abi, wallet)
    let contractWithSigner = contract.connect(wallet)
    let node = await contractWithSigner.getNodeId(wallet.address)
    console.log(node._hex)
    if (node._hex !== '0x00') {        
        console.log('Node already present, nothing to do...')
        if (!process.env.NODEID) {
            process.env.NODEID = node._hex            
            console.log('NodeID set...')
            console.log(process.env.NODEID)
        }
    } else {
        const tx = await contractWithSigner.login(code, nodeName)
        console.log(tx)  

        const isTxnMined = async (txnHash: string) => {
            const txnreceipt: any = await provider.getTransactionReceipt(txnHash)
            if (txnreceipt) {
                if (txnreceipt.blockNumber) {
                    console.log('Txn Block: ', txnreceipt.blockNumber)
                    console.log('Txn: ', txnreceipt)
                    node = await contractWithSigner.getNodeId(wallet.address)
                    console.log('Node ID: ', node._hex)
                    process.env.NODEID = node
                    console.log('NodeID set...')
                }
            }
            else {
                console.log('waiting....')
                setTimeout(() => { isTxnMined(txnHash), 500})
            }
        }
        isTxnMined(tx.hash)
    }
}

login(code, 'node1')


/*

contract.on('invoked', async(event) => {
    console.log(event)
    if (event) {        
        let invoke = await contract.getApiSpec()
        console.log('Invoke: ', invoke)
    }     
})
*/