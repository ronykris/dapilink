import {ethers} from 'ethers'

const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = '0x5086B891fFf929591d6914b25E9145FfE7bC207f'
let contract = new ethers.Contract(contractAddr, abi, provider)

const getData = async (txHash: string) => {
    const tx = await provider.getTransaction(txHash)
    console.log(tx)
    const iface = new ethers.utils.Interface(abi)
    let decodedData = iface.parseTransaction({ data: tx.data })
    console.log(`Decoded txn input: ${decodedData.args}`)
    try {
        let storedData = await provider.getStorageAt(contractAddr, '0x00')
        console.log(storedData)
    } catch (err) {
        console.log(err)
    }
    
    
}

//getData('0x1fd0b5ca80357a8af09b45e59be18424b3bf797d464f84dcb7dcd883077ab649')
getData('0x8d2861e9dd2dd766837e841cd8c111feb9a50006e79bfd84e0535fde4d005dd3')

