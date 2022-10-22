import { decryptMedia } from '@open-wa/wa-automate'
import mime from 'mime'
import sharp from 'sharp'
import Jimp from 'jimp'
import fs from 'fs'

const stickerHandler = async (client, message) => {
    //verifying if there is any image or video on message
    if (!message.mimetype) {
        await client.sendText(message.from, 'Nenhuma imagem encontrada')
        return
    }
    //decrypting the mimetype
    const filename = `${message.t}.${mime.extension(message.mimetype)}`
    const mediaData = await decryptMedia(message)
    const fileBase64 = `data:${message.mimetype};base64,${mediaData.toString(
        'base64'
    )}`

    if (message.type === 'video') {
        await client.sendMp4AsSticker(message.from, fileBase64)
    }
    if (message.type === 'image') {
        //getting the words
        const words = message.text.substring(4)

        //resizing image
        sharp(mediaData)
            .rotate()
            .resize(300, 300)
            .jpeg({ mozjpeg: true })
            .toBuffer()
            .then(async (data) => {
                // Defining the text font
                const image = await Jimp.read(data)
                const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
                image.print(
                    font,
                    image.bitmap.width * 0.2,
                    image.bitmap.height * 0.75,
                    words
                )

                // Writing image after processing
                await image.writeAsync(filename)
                //sending sticker
                await client.sendImageAsSticker(message.from, filename)
                fs.unlink(filename, (err) => {
                    if (err) return err
                })
            })
            .catch(async () => {
                await client.sendText(
                    message.from,
                    'Erro ao criar a figurinha.'
                )
            })
    }
}

export default stickerHandler
