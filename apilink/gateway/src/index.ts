import {ethers} from 'ethers'

const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = '0x6C462036d8CfE3a4935D7f4694aAE0b746406db7'
let contract = new ethers.Contract(contractAddr, abi, provider)

contract.on('invoked', async(event) => {
    console.log(event)
    if (event) {        
        let invoke = await contract.getApiSpec()
        console.log('Invoke: ', invoke)
    }     
})