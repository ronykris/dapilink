import  invokeApi from './index'

let epoch: number = Date.now()
let text: string = 'Coffee'
let callId: number = parseInt(epoch+text)
console.log(callId)

let endpoint: string = 'https://serpapi.com/search.json?engine=google'
let APIKEY = process.env.API_KEY || ''
let endpointParams = `${endpoint}&q=${text}&api_key=${APIKEY}`

const api = {
    callid: callId.toString(),
    endpoint: endpointParams,
    method: 'GET',
    body: '',
    headers: ''
}

const invoke = async() => {
    await invokeApi(api)
}

invoke()