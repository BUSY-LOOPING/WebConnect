if (process.env.NODE_ENV !== "production") {
    const dotenv = await import("dotenv")
    dotenv.config()
}

import FormData from 'form-data'
import cors from 'cors'
import http from 'http'
import express from 'express'
import { Server } from 'socket.io'
import fs from 'fs'
import { exec } from 'child_process'
import axios from 'axios'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import OpenAI from 'openai'

const openai = new OpenAI({
    baseURL: process.env.BASE_URL,
    apiKey: process.env.OPEN_AI_KEY,
})

const s3 = new S3Client({
    endpoint: process.env.MINIO_ENDPOINT,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    },
    region: process.env.BUCKET_REGION,
    forcePathStyle: true
})

const app = express()
const server = http.createServer(app)

app.use(cors())

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})
if (!fs.existsSync("temp_upload")) {
    fs.mkdirSync("temp_upload", { recursive: true })
}

io.on('connection', (socket) => {
    console.log('🟢Socket is connected')

    socket.on('video-chunks', async (data) => {

        const filepath = 'temp_upload/' + data.filename
        const buffer = Buffer.from(data.chunks)

        try {
            await fs.promises.appendFile(filepath, buffer)
            console.log('🟢Chunk Saved')
        } catch (err) {
            console.error('Write error', err)
        }
    })

    socket.on('process-video', async (data) => {
        const videoPath = 'temp_upload/' + data.filename
        if (!fs.existsSync(videoPath)) {
            console.log("File not ready yet")
            return
        }

        const file = await fs.promises.readFile(videoPath)
        console.log("Video size:", file.length)

        const processing = await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/processing`, {
            filename: data.filename
        })

        if (processing.data.status !== 200) return

        const command = new PutObjectCommand({
            Key: data.filename,
            Bucket: process.env.BUCKET_NAME || 'test',
            ContentType: 'video/webm',
            Body: file
        })

        const fileStatus = await s3.send(command)

        if (fileStatus['$metadata'].httpStatusCode === 200) {
            console.log('file uploaded to s3')
            if (processing.data.plan === 'PRO') {
                const audioPath = `temp_upload/${data.filename}.mp3`

                exec(`ffmpeg -i ${videoPath} -vn -acodec libmp3lame -ab 192k -y ${audioPath}`, async (error, stdout, stderr) => {
                    if (error) {
                        console.error("FFMPEG ERROR:", error)
                        console.error(stderr)
                        return
                    }
                    fs.stat(audioPath, async (err, stat) => {
                        if (err) return

                        const MAX = 25000000

                        const transcribeChunk = async (start, duration, index) => {
                            const chunkFile = `temp_upload/${data.filename}_${index}.mp3`

                            await new Promise((resolve) => {
                                exec(`ffmpeg -ss ${start} -t ${duration} -i ${audioPath} -acodec copy -y ${chunkFile}`, () => resolve())
                            })

                            const form = new FormData()
                            form.append('audio_file', fs.createReadStream(chunkFile), {
                                filename: `${data.filename}_${index}.mp3`,
                                contentType: 'audio/mpeg'
                            })

                            const res = await axios.post(
                                `${process.env.WHISPER_URL}/asr?task=transcribe&output=txt`,
                                form,
                                {
                                    headers: {
                                        ...form.getHeaders(),
                                        'Accept': 'application/json'
                                    },
                                    timeout: 120000
                                }
                            )

                            fs.unlinkSync(chunkFile)
                            return res.data
                        }

                        let transcript = ''

                        if (stat.size < MAX) {
                            const form = new FormData()
                            form.append('audio_file', fs.createReadStream(audioPath), {
                                filename: data.filename,
                                contentType: 'audio/mpeg'
                            })

                            const res = await axios.post(
                                `${process.env.WHISPER_URL}/asr?task=transcribe&output=txt`,
                                form,
                                {
                                    headers: {
                                        ...form.getHeaders(),
                                        'Accept': 'application/json'
                                    },
                                    timeout: 120000
                                }
                            )

                            transcript = res.data

                        } else {
                            const duration = await new Promise((resolve) => {
                                exec(`ffprobe -i ${audioPath} -show_entries format=duration -v quiet -of csv="p=0"`, (err, stdout) => {
                                    resolve(parseFloat(stdout))
                                })
                            })

                            const segment = 300
                            const parts = Math.ceil(duration / segment)

                            for (let i = 0; i < parts; i++) {
                                const start = i * segment
                                const text = await transcribeChunk(start, segment, i)
                                transcript += ' ' + text
                            }
                        }
                        console.log('Transcription', transcript)

                        if (transcript) {
                            const completion = await openai.chat.completions.create({
                                model: 'qwen2.5-coder:14b',
                                response_format: { type: 'json_object' },
                                messages: [
                                    {
                                        role: 'system',
                                        content: `You are going to generate a title and nice description using the speech to text transcription provided: transcription(${transcript}) and then return it in json format as {"title": <the title you gave>, "summary": <the summary you gave>}`
                                    }
                                ]
                            })

                            console.log('AI Response', completion.choices[0].message.content)

                            await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/transcribe`, {
                                filename: data.filename,
                                content: completion.choices[0].message.content,
                                transcript: transcript
                            })
                        }

                        fs.unlinkSync(audioPath)
                    })
                })

                const stopProcessing = await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/complete`, {
                    filename: data.filename
                })

                if (stopProcessing.status === 200) {
                    fs.unlink(videoPath, () => { })
                }
            }
        }

    })

    socket.on('disconnect', () => {
        console.log('🟢Socket.id is diconnected', socket.id)
    })
})

const PORT = process.env.EXPRESS_PORT || 5000;

server.listen(PORT, () => {
    console.log('🟢Listening to port ' + PORT)
})