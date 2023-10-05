import dotenv from 'dotenv'
import { spawnSync } from "child_process";
dotenv.config()

const retrieveFromIpfs = async (cid) => {  
  const execute = spawnSync('ipfs', ['cat', '--api', `/ip4/${process.env.IPFS_GATEWAY}/tcp/8080`, `${cid}`], {encoding: 'utf8'})
  if (execute.error) {
    throw new Error("execution error: " + execute.error.message)
  }
  if (execute.stderr) {
    throw new Error("execution error: " + execute.stderr.toString())
  }
  try {
    const jsonData = JSON.parse(execute.stdout.trim())
    console.log(jsonData)
    return jsonData
  } catch (e) {
    console.error(e)
    return null
  }  
}

export default async function handler(req, res) {
    const query = req.query.id
    console.log(query) 
    try {
      const searchResult = await retrieveFromIpfs(query)
      res.status(200).json(searchResult);
    } catch (e) {
      console.error(e)
      res.status(400).json(e.message)
    }
    
}