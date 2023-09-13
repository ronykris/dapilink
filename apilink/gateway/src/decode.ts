import {ethers} from 'ethers'

const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = '0x7e49c974CFa3774AcbD68059AcF36e2D284e108B'
let contract = new ethers.Contract(contractAddr, abi, provider)

const getData = async (txHash: string) => {
    const tx = await provider.getTransaction(txHash)
    console.log(tx)
    const iface = new ethers.utils.Interface(abi)
    try {
        console.log('Attempting to read the txn data...')
        let decodedData = iface.parseTransaction({ data: tx.data, value: tx.value})
        console.log(`Decoded txn input: ${decodedData.args}`)
    } catch (e) {        
        console.log(e)
    }    
    try {
        let storedData = await provider.getStorageAt(contractAddr, '0x00')
        console.log(storedData)
    } catch (err) {
        console.log(err)
        let data = await contract.getApiSpec()
        console.log('Data written: ',data)    
    }

    
    
}

//getData('0x1fd0b5ca80357a8af09b45e59be18424b3bf797d464f84dcb7dcd883077ab649')
getData('0xa922804a35451808c2b37c88ec061ac1a8ea2dafafb7d6246febb7ecb2b60f54')

