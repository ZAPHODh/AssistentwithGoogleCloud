import fetch from 'node-fetch'
const sign = [
    { english: 'aries', portuguese: 'áries' },
    { english: 'taurus', portuguese: 'touro' },
    { english: 'gemini', portuguese: 'gêmeos' },
    { english: 'cancer', portuguese: 'câncer' },
    { english: 'leo', portuguese: 'leão' },
    { english: 'virgo', portuguese: 'virgem' },
    { english: 'libra', portuguese: 'libra' },
    { english: 'scorpio', portuguese: 'escorpião' },
    { english: 'sagittarius', portuguese: 'sagitário' },
    { english: 'capricorn', portuguese: 'capricórnio' },
    { english: 'aquarius', portuguese: 'aquário' },
    { english: 'pisces', portuguese: 'peixes' },
]
const handlerHoroscope = async (client, message) => {
    const word = message.text.substring(3).toLowerCase()

    const exists = sign.filter((each) => {
        return each.portuguese === word
    })

    if (exists.length === 0) {
        await client.sendText(message.from, 'Signo nao reconhecido')
        return
    }
    const URL = `https://aztro.sameerkumar.website/?sign=${exists[0].english}&day=today`
    fetch(URL, {
        method: 'POST',
    })
        .then((response) => response.json())
        .then(async (json) => {
            await client.sendText(message.from, json.description)
        })
}

export default handlerHoroscope
