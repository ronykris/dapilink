import {ethers} from 'ethers'

const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider()
let contractAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
let contract = new ethers.Contract(contractAddr, abi, provider)

contract.on('invoked', async(event) => {
    console.log(event)
    if (event) {        
        let invoke = await contract.getApiSpec()
        console.log('Invoke: ', invoke)
    }     
})