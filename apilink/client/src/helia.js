const { createHelia } = require('helia')
const { json } = require('@helia/json')

const helia = async () => {
    const helia = await createHelia()
const j = json(helia)

const myImmutableAddress = await j.add({ hello: 'world' })
console.log(myImmutableAddress)
}
helia()
