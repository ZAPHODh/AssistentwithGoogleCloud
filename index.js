import { create, Client } from '@open-wa/wa-automate'
import ytHandler from './handles/ytHandler.js'
import stickerHandler from './handles/stickerHandler.js'
import speechToTextHandler from './handles/handlerSpeechToText.js'
import translateAudio from './handles/handleTranslateAudio.js'
import createAudio from './handles/handleTextToSpeech.js'
import convertFile from './handles/handleConvertFile.js'

function start(client = Client) {
    client.onAnyMessage(async (message) => {
        if (message.text.includes('!convert')) {
            await convertFile(client, message)
        }
        if (message.text.includes('!toAudio')) {
            await createAudio(client, message)
        }
        if (message.text.includes('!trAudio')) {
            await translateAudio(client, message)
        }
        if (message.text.includes('!fig')) {
            await stickerHandler(client, message)
        }
        if (message.text.includes('!yt')) {
            await ytHandler(client, message)
        }
        if (message.text.includes('!Speech'))
            await speechToTextHandler(client, message)
    })
}

create({
    useChrome: true,
    executablePath:
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    sessionId: 'test00',
}).then((client) => start(client))
