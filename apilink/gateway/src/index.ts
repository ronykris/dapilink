import {ethers} from 'ethers'

const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider()
let contractAddr = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
let contract = new ethers.Contract(contractAddr, abi, provider)

contract.on('invoked', (event) => { console.log(event) })