import * as textToSpeech from '@google-cloud/text-to-speech'
const clientGoogle = new textToSpeech.TextToSpeechClient()

const createAudio = async (client, message) => {
    if (!message.quotedMsg) {
        await client.sendText(message.from, 'Nenhum texto selecionado')
        return
    }
    if (message.quotedMsg.mimetype) {
        await client.sendText(
            message.from,
            'a mensagem selecionada é um arquivo.'
        )
        return
    }
    //texto a ser transformado em audio
    const text = message.quotedMsg.text

    // construindo a solicitação
    const request = {
        input: { text: text },
        voice: { languageCode: 'pt-BR', ssmlGender: 'MALE' },
        audioConfig: { audioEncoding: 'MP3' },
    }

    // executando a chamada.
    const [response] = await clientGoogle.synthesizeSpeech(request)

    //testando base64
    const audioBase64 = `data:audio/mpeg;base64,${response.audioContent.toString(
        'base64'
    )}`
    await client.sendFile(message.from, audioBase64)
}
export default createAudio
