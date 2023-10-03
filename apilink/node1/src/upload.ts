import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";
import axios from "axios";

const container = 'b9a503cfdf33'

const makeFIle = async (jsonObj: object, id: string) => {
  const json = JSON.stringify(jsonObj)
  const buffer = Buffer.from(json)
  fs.writeFileSync(path.resolve(`./${id}.json`), buffer)    
  return path.resolve(`./${id}.json`)
}

const upload = async (jsonObj: object, id: string) => {
  const cmd = `docker exec ${container} ipfs add ${await makeFIle(jsonObj, id)}`
  const execute = spawnSync(cmd)
  if (execute.error) {
    throw new Error("execution error: " + execute.error.message)
  }
  if (execute.stderr) {
    throw new Error("execution error: " + execute.stderr.toString())
  }
  const output = execute.stdout.toString()
  console.log(output)
}

upload({hello: 'world'}, '123456')


const retrieve = async (cid: string) => {
  const cmd = `docker exec ${container} ipfs cat /ipfs/${cid}`
  const execute = spawnSync(cmd, {encoding: 'utf8'})
  if (execute.error) {
    throw new Error("execution error: " + execute.error.message)
  }
  if (execute.stderr) {
    throw new Error("execution error: " + execute.stderr.toString())
  }
  try {
    const jsonData = JSON.parse(execute.stdout.trim())
    return jsonData
  } catch (e) {
    console.error(e)
  }
  const output = execute.stdout.toString()
  console.log(output)
}