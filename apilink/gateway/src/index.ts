import {ethers} from 'ethers'

const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = '0x7e49c974CFa3774AcbD68059AcF36e2D284e108B'
let contract = new ethers.Contract(contractAddr, abi, provider)

contract.on('invoked', async(event) => {
    console.log(event)
    if (event) {        
        let invoke = await contract.getApiSpec()
        console.log('Invoke: ', invoke)
    }     
})