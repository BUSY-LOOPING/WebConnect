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
    // ✅ Critical: increase buffer size for large video chunks (100MB)
    maxHttpBufferSize: 1e8,
    // ✅ Prevent ping timeout during heavy file writes
    pingInterval: 10000,
    pingTimeout: 60000,
    // ✅ Allow more time for slow connections
    connectTimeout: 30000,
})

if (!fs.existsSync("temp_upload")) {
    fs.mkdirSync("temp_upload", { recursive: true })
}

// ✅ Per-socket write queues to serialize chunk writes and prevent race conditions
const writeQueues = new Map()

const getWriteQueue = (socketId) => {
    if (!writeQueues.has(socketId)) {
        writeQueues.set(socketId, Promise.resolve())
    }
    return writeQueues.get(socketId)
}

const queueWrite = (socketId, fn) => {
    const next = getWriteQueue(socketId).then(fn).catch((err) => {
        console.error(`Write queue error for ${socketId}:`, err)
    })
    writeQueues.set(socketId, next)
    return next
}

io.on('connection', (socket) => {
    console.log('🟢 Socket connected:', socket.id)

    // ✅ Track chunks received per file for debugging
    const chunkCount = {}

    socket.on('video-chunks', (data) => {
        // ✅ NOT async — queue the write instead of blocking the event loop
        if (!data?.chunks || !data?.filename) {
            console.warn('⚠️ Invalid chunk data received')
            return
        }

        const filepath = 'temp_upload/' + data.filename
        const buffer = Buffer.from(data.chunks)

        chunkCount[data.filename] = (chunkCount[data.filename] || 0) + 1

        // Queue writes serially per socket — no concurrent appends to the same file
        queueWrite(socket.id, async () => {
            await fs.promises.appendFile(filepath, buffer)
            console.log(`🟢 Chunk #${chunkCount[data.filename]} saved for ${data.filename} (${buffer.length} bytes)`)
        })
    })

    socket.on('process-video', async (data) => {
        await getWriteQueue(socket.id)

        const inputPath = 'temp_upload/' + data.filename
        const mp4Filename = data.filename.replace(/\.(webm|mp4|mkv)$/, '.mp4')
        const mp4Path = 'temp_upload/' + mp4Filename

        if (!fs.existsSync(inputPath)) {
            console.error('File not found:', inputPath)
            return
        }

        try {
            const processing = await axios.post(
                `${process.env.NEXT_API_HOST}recording/${data.userId}/processing`,
                {
                    filename: mp4Filename,
                    workspaceId: data.workspaceId || null,
                    folderId: data.folderId || null,
                }
            )
            if (processing.data.status !== 200) {
                console.error('❌ Processing API returned non-200:', processing.data)
                return
            }
            // Convert to MP4 regardless of input format
            // -c:v copy tries to stream-copy if already H264 (fast, no re-encode)
            // If that fails (VP9 input), falls back to re-encoding
            const inputIsWebm = data.filename.endsWith('.webm')

            if (inputIsWebm) {
                console.log('🔄 Converting WebM → MP4...')
                await execAsync(
                    `ffmpeg -i ${inputPath} -c:v libx264 -preset fast -crf 23 -c:a aac -movflags +faststart -y ${mp4Path}`
                )
            } else {
                console.log('Remuxing MP4...')
                await execAsync(
                    `ffmpeg -i ${inputPath} -c copy -movflags +faststart -y ${mp4Path}`
                )
            }

            console.log('Conversion to mp4 done')

            const mp4File = await fs.promises.readFile(mp4Path)

            const command = new PutObjectCommand({
                Key: mp4Filename,
                Bucket: process.env.BUCKET_NAME || 'test',
                ContentType: 'video/mp4',
                Body: mp4File,
            })

            const fileStatus = await s3.send(command)
            if (fileStatus['$metadata'].httpStatusCode !== 200) {
                console.error('S3 upload failed')
                return
            }

            console.log('MP4 uploaded to S3:', mp4Filename)

            // PRO: extract audio from the already-converted mp4 (faster than from webm)
            if (processing.data.plan === 'PRO') {
                await handleProProcessing(
                    { ...data, filename: mp4Filename },
                    mp4Path
                )
            } else {
                await handleFreeProcessing(data, mp4Path)
            }

        } finally {
            await fs.promises.unlink(inputPath).catch(() => { })
            await fs.promises.unlink(mp4Path).catch(() => { })
        }
    })

    socket.on('disconnect', (reason) => {
        console.log(`🔴 Socket disconnected: ${socket.id} — reason: ${reason}`)
        // ✅ Clean up write queue for this socket
        writeQueues.delete(socket.id)
    })
})

// ✅ Extracted and promisified — no more nested exec callbacks
const execAsync = (cmd) => new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
        if (error) reject({ error, stderr })
        else resolve(stdout)
    })
})

const handleProProcessing = async (data, videoPath) => {
    const audioPath = `temp_upload/${data.filename}.mp3`

    try {
        await execAsync(`ffmpeg -i ${videoPath} -vn -acodec libmp3lame -ab 192k -y ${audioPath}`)

        const stat = await fs.promises.stat(audioPath)
        const MAX = 25_000_000
        let transcript = ''

        if (stat.size < MAX) {
            transcript = await transcribeFile(audioPath, data.filename)
        } else {
            const durationStr = await execAsync(
                `ffprobe -i ${audioPath} -show_entries format=duration -v quiet -of csv="p=0"`
            )
            const duration = parseFloat(durationStr)
            const segment = 300
            const parts = Math.ceil(duration / segment)

            for (let i = 0; i < parts; i++) {
                const text = await transcribeChunk(audioPath, data.filename, i * segment, segment, i)
                transcript += ' ' + text
            }
        }

        console.log('📝 Transcription complete, length:', transcript.length)

        if (transcript && transcript.length > 0) {
            const completion = await openai.chat.completions.create({
                model: 'qwen2.5-coder:14b',
                response_format: { type: 'json_object' },
                messages: [{
                    role: 'system',
                    content: `You are an expert meeting analyst and content summarizer. You will receive a speech-to-text transcription of a recorded video or meeting session which may involve one or more speakers.

Analyze the transcription carefully and produce:
1. A concise, descriptive TITLE that captures the core topic or purpose (max 10 words)
2. A structured SUMMARY that includes:
   - Main topic or purpose of the recording
   - Key points discussed or decisions made
   - Action items or next steps (if any)
   - Notable participants or roles (if identifiable from context)

Transcription:
${transcript}

Rules:
- If multiple speakers are present, reflect that in the summary
- Be specific, not generic — avoid filler phrases like "the speaker discusses..."
- The title should be professional and searchable
- Summary should be 3-5 sentences maximum
- Return ONLY valid JSON, no markdown, no backticks, no preamble

Return format:
{"title": "<your title>", "summary": "<your summary>"}`
                }]
            })

            console.log('🤖 AI Response:', completion.choices[0].message.content)

            await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/transcribe`, {
                filename: data.filename,
                content: completion.choices[0].message.content,
                transcript
            })
        }

    } finally {
        await fs.promises.unlink(audioPath).catch(() => { })
        await completeAndCleanup(data, videoPath)
    }
}

const handleFreeProcessing = async (data, videoPath) => {
    await completeAndCleanup(data, videoPath)
}
 
const completeAndCleanup = async (data, videoPath) => {
    try {
        const stopProcessing = await axios.post(
            `${process.env.NEXT_API_HOST}recording/${data.userId}/complete`,
            { filename: data.filename }
        )
        if (stopProcessing.status === 200) {
            console.log('Cleanup complete for', data.filename)
        }
    } catch (err) {
        console.error('completeAndCleanup failed:', err?.response?.data || err?.message)
    } finally {
        await fs.promises.unlink(videoPath).catch(() => {})
    }
}

const transcribeFile = async (audioPath, filename) => {
    const form = new FormData()
    form.append('audio_file', fs.createReadStream(audioPath), {
        filename,
        contentType: 'audio/mpeg'
    })

    const res = await axios.post(
        `${process.env.WHISPER_URL}/asr?task=transcribe&output=txt`,
        form,
        { headers: { ...form.getHeaders(), Accept: 'application/json' }, timeout: 120000 }
    )
    return res.data
}

const transcribeChunk = async (audioPath, filename, start, duration, index) => {
    const chunkFile = `temp_upload/${filename}_${index}.mp3`

    await execAsync(`ffmpeg -ss ${start} -t ${duration} -i ${audioPath} -acodec copy -y ${chunkFile}`)

    const form = new FormData()
    form.append('audio_file', fs.createReadStream(chunkFile), {
        filename: `${filename}_${index}.mp3`,
        contentType: 'audio/mpeg'
    })

    const res = await axios.post(
        `${process.env.WHISPER_URL}/asr?task=transcribe&output=txt`,
        form,
        {
            headers: { ...form.getHeaders(), Accept: 'application/json' },
            timeout: 600000
        }
    )

    await fs.promises.unlink(chunkFile).catch(() => { })
    return res.data
}

const PORT = process.env.EXPRESS_PORT || 5000

server.listen(PORT, () => {
    console.log('🟢 Listening on port ' + PORT)
})