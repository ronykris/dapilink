import  invokeApi from './index'

let epoch: number = Date.now()
let text: string = 'Coffee'
let callId: number = parseInt(epoch+text)
console.log(callId)

let endpoint: string = 'https://serpapi.com/search.json?engine=google'
let APIKEY = process.env.API_KEY || ''

const invoke = async() => {
    await invokeApi({
        callid: callId.toString(),
        endpoint: `${endpoint}&q=${text}&api_key=${APIKEY}`,
        method: 'GET',
        body: '',
        headers: ''
    })
}

invoke()