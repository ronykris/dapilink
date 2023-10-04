import {ethers} from 'ethers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import {spawnSync} from "child_process"
import  dotenv from 'dotenv'
dotenv.config()

//const { abi } = require('../../artifacts/contracts/Apilink.sol/Apilink.json')
const { abi } = require('./Apilink.json')

let provider = new ethers.providers.JsonRpcProvider("https://testnet.sapphire.oasis.dev")
let contractAddr = process.env.CONTRACT

var nodeKey = process.env.NODE_KEY || ''
var code = process.env.CODE || ''
/*
var overrides = {
  value: ethers.utils.parseEther('0.01')
}*/

const setEnv = async (envVar: string, value: string) => {
    let updateEnvCmd = `echo ${envVar}=${value} >> .env`
    var env = spawnSync('bash', ['-c', updateEnvCmd])
    if (env.error) {
        throw new Error('Error updating .env: ' + env.error.message)
    }
    if (env.status != 0) {
        throw new Error('Failed to update .env ' + env.status)
    }        
    dotenv.config()
}

const ipfsCheck = async (): Promise<number> => {
    const execute = spawnSync('ipfs', ['--version'])        
    if (execute.status) {
        console.log(execute.stdout.toString())
        return execute.status        
    }
}

const installIpfs = async () => {
    const isIPFSPresent = await ipfsCheck()
    if ( isIPFSPresent !== 0 ) {
        console.log('Installing ipfs...')
        const cmds = [
            {cmd: 'wget', args: ['https://dist.ipfs.io/go-ipfs/v0.9.0/go-ipfs_v0.9.0_linux-amd64.tar.gz']},
            {cmd: 'tar', args: ['-xvzf','go-ipfs_v0.9.0_linux-amd64.tar.gz']},
            {cmd: 'cd', args: ['go-ipfs']},
            {cmd: 'sh', args: ['install.sh']},
            {cmd: 'ipfs', args: ['--version']}
        ]
        try {
            let status = 0   
            for (let i = 0; i<cmds.length; i++) {
                const execute = spawnSync(cmds[i].cmd, cmds[i].args)        
                status = execute.status
                if (status === 0) {
                    try {
                        console.log(execute.stdout.toString())
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
        } catch (e) {
            throw new Error('IPFS install failed: ' + e.message)            
        }
    }
}

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
        await installIpfs()
        if (!process.env.NODEID) {
            await setEnv('NODEID', node._hex)     
            console.log('NodeID set...')
            console.log(process.env.NODEID)
        }
    } else {
        const tx = await contractWithSigner.login(code, nodeName)
        console.log(tx)  
        await installIpfs()
        const isTxnMined = async (txnHash: string) => {
            const txnreceipt: any = await provider.getTransactionReceipt(txnHash)
            if (txnreceipt) {
                if (txnreceipt.blockNumber) {
                    console.log('Txn Block: ', txnreceipt.blockNumber)
                    console.log('Txn: ', txnreceipt)
                    node = await contractWithSigner.getNodeId(wallet.address)
                    console.log('Node ID: ', node._hex)
                    if (!process.env.NODEID) {
                        await setEnv('NODEID', node._hex)     
                        console.log('NodeID set...')
                        console.log(process.env.NODEID)
                    }                      
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