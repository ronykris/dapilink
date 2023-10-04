
import { spawnSync } from "child_process";

const ipfsCheck = async (): Promise<number> => {
    const execute = spawnSync('ipfs', ['--version'])        
    if (execute.status) {
        console.log(execute.stdout.toString())
        return execute.status        
    }
}

const installIpfs = async () => {
    const isIPFSPresent = await ipfsCheck()
    if ( !isIPFSPresent ) {
        console.log('Installing ipfs...')
        const cmds = [
            {cmd: 'wget', args: ['https://dist.ipfs.io/go-ipfs/v0.9.0/go-ipfs_v0.9.0_linux-amd64.tar.gz']},
            {cmd: 'tar', args: ['-xvzf','go-ipfs_v0.9.0_linux-amd64.tar.gz']},
            {cmd: 'cd', args: ['go-ipfs']},
            {cmd: 'sudo', args: ['bash', 'install.sh']},
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

installIpfs()