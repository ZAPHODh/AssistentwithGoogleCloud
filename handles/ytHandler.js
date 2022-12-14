/* eslint-disable */

import yt from 'youtube-search-without-api-key'
import YoutubeMp3Downloader from 'youtube-mp3-downloader'
import fs from 'fs'
import ytdl from 'ytdl-core'

async function ytHandler(client, message) {
    const content = message.text.substring(3)

    const filter = (m) => m.from === message.from

    const collector = client.createMessageCollector(message.from, filter, {
        time: 1000 * 15, // 15sec
        max: 1,
    })
    await client.sendText(
        message.from,
        'Escolha como voce quer receber o arquivo:\n1. AUDIO \n2. VIDEO'
    )

    collector.on('collect', async (m) => {
        const collected = m.content
        switch (collected) {
        case '1':
            const audio = await yt.search(content).catch((err) => err)
            const dr = Number(audio[0].duration_raw.replace(`:`, `.`))
            console.log(dr)
            // eslint-disable-next-line no-restricted-globals
            if (dr >= 9 || isNaN(dr)) {
                await client.sendText(message.from, 'Audio muito grande')
            } else {
                const YD = new YoutubeMp3Downloader({
                    ffmpegPath: 'C:/PATH_Programs/ffmpeg',
                    outputPath: 'D:/WPP',
                    youtubeVideoQuality: 'highestaudio',
                    queueParallelism: 2,
                    progressTimeout: 2000,
                    allowWebm: false,
                })

                YD.download(audio[0].url.substring(32))

                YD.on('finished', async function (err, data) {
                    try {
                        await client.sendFile(message.from, data.file).then(
                            // eslint-disable-next-line consistent-return
                            fs.unlink(data.file, (err) => {
                                if (err) return err
                            })
                        )
                    } catch (error) {
                        console.log(error)
                    }
                })
                return
            }
            return

        case '2':
            const video = await yt.search(content).catch((err) => err)
            const vd = `${video[0].id.videoId}.mp4`
            const dura = Number(video[0].duration_raw.replace(`:`, `.`))
            if (dura >= 9 || isNaN(dura)) {
                await client.sendText(message.from, 'Video muito grande')
            } else {
                ytdl(video[0].url)
                    .pipe(fs.createWriteStream(vd))
                    .on('finish', async () => {
                        try {
                            await client.sendImage(message.from, vd).then(
                                // eslint-disable-next-line consistent-return
                                fs.unlink(vd, (err) => {
                                    if (err) return err
                                })
                            )
                        } catch {
                            await client.sendText(
                                message.from,
                                'Nao foi possivel enviar'
                            )
                        }
                    })
                return
            }
        }
    })
    collector.on('end', (m) => {
        if (m.size < 1) {
            client.sendText(message.from, 'Voc?? n??o escolheu nenhuma op????o')
        }
    })
}

export default ytHandler
