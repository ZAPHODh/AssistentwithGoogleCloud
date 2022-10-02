import * as speech from '@google-cloud/speech'
import { decryptMedia } from '@open-wa/wa-automate'
import { Storage } from '@google-cloud/storage'
import dotenv from 'dotenv'
dotenv.config();
import mime from 'mime'
import fs from 'fs'
const storage = new Storage();
const bucket = storage.bucket(process.env.BUCKET_NAME);

const speechToTextHandler = async (client, message)=>{
    if(!message.quotedMsg){
        await client.sendText(message.from, "Nenhum audio selecionado.")
        return
    }
    if(!message.quotedMsg.mimetype.includes('audio')){
        await client.sendText(message.from,"O arquivo selecionado não é um audio.")
        return
    }
    const filename = `${message.quotedMsg.chat.t}.${mime.extension(message.quotedMsg.mimetype)}`;
    const mediaData = await decryptMedia(message.quotedMsg);
    fs.writeFileSync(filename,mediaData);
    const speechClient = new speech.SpeechClient();
    await bucket.upload(filename);
    fs.unlinkSync(filename,()=>{});

      // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        uri: `gs://${process.env.BUCKET_NAME}/${filename}`,
    };
    const config = {
        encoding: 'OGG_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'pt-BR',
    };
    const request = {
        audio: audio,
        config: config,
    };
    const [response] = await  speechClient.recognize(request);
    const transcription = await response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
    await client.sendText(message.from,`Palavras reconhecidas no Audio : ${transcription}`)
    bucket.deleteFiles(filename)
}
export default speechToTextHandler;
