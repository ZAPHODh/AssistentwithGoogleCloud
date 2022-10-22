const diceHandler = async (client, message) => {
    const number = Number(message.text.substring(2))
    const random = Math.floor(Math.random() * number)
    const result = random === 0 ? 1 : random
    await client.sendText(message.from, result)
}

export default diceHandler
