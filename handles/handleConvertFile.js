import ConvertAPI from 'convertapi'
import { decryptMedia } from '@open-wa/wa-automate'
import mime from 'mime'
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

// eslint-disable-next-line no-undef
const convertapi = new ConvertAPI(process.env.CONVERT_API)

const convertFile = async (client, message) => {
    if (!message.quotedMsg) {
        await client.sendText(message.from, 'Nenhum arquivo selecionado.')
        return
    }
    if (!message.quotedMsg.mimetype) {
        await client.sendText(
            message.from,
            'A mensagem selecionada não é um arquivo'
        )
        return
    }
    //nome do arquivo selecionado
    const filename = `${message.quotedMsg.chat.t}.${mime.extension(
        message.quotedMsg.mimetype
    )}`
    //data do arquivo selecionado
    const mediaData = await decryptMedia(message.quotedMsg)

    //arquivo selecionado em base64
    // const fileBase64 = `data:${
    //     message.quotedMsg.mimetype
    // };base64,${mediaData.toString('base64')}`

    fs.writeFile(filename, mediaData, function (err) {
        if (err) {
            return console.log(err)
        }
    })

    convertapi
        .convert(
            'pdf',
            { File: filename },
            mime.extension(message.quotedMsg.mimetype)
        )
        .then(function (result) {
            // save to file
            return result.file
        })
        .then(async function (file) {
            await client.sendFileFromUrl(
                message.from,
                file.fileInfo.Url,
                `${message.quotedMsg.chat.t}.pdf`
            )
        })
        .catch(async function () {
            await client.sendText(message.from, 'Erro ao converter o arquivo.')
        })
        .finally(() => {
            fs.unlink(filename, () => {})
        })
}
export default convertFile
