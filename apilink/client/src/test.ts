import  invokeApi from './index'
import dotenv from 'dotenv'
dotenv.config()

let epoch: number = Date.now()
let text: string = 'roger binny'
let callId: number = parseInt(epoch+text)
console.log(callId)

let endpoint: string = 'https://serpapi.com/search.json?engine=google'
let APIKEY = process.env.API_KEY || ''
let endpointParams = `${endpoint}&q=${text}&api_key=${APIKEY}`

const api: any= {
    callid: callId,
    endpoint: endpointParams,
    method: 'GET',
    body: '',
    headers: ''
}

const invoke = async(callId: number, endpoint: string, method: string, body: string, headers: string) => {      
    await invokeApi(callId, endpoint, method, body, headers)
}

invoke(callId, endpointParams, 'GET', '', '')