import {ethers} from 'ethers'

const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = '0x5086B891fFf929591d6914b25E9145FfE7bC207f'
let contract = new ethers.Contract(contractAddr, abi, provider)

contract.on('invoked', async(event) => {
    console.log(event)
    if (event) {        
        let invoke = await contract.getApiSpec()
        console.log('Invoke: ', invoke)
    }     
})