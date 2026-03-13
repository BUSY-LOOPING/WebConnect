'use client'

import { useState, useRef, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Video, Monitor, Circle, Square, Mic, MicOff, VideoOff, RotateCcw, Trash2, Clock } from "lucide-react"
import { io, Socket } from "socket.io-client"
import { getUser } from "@/actions/user"

type RecordMode = "camera" | "screen" | "both"
type RecordState = "idle" | "countdown" | "recording" | "preview"

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

const ModeButton = ({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-5 rounded-xl border transition-all duration-200 w-36 ${active ? "bg-[#252525] border-[#3a3a3a] text-white" : "bg-transparent border-[#1e1e1e] text-[#6b6b6b] hover:border-[#2e2e2e] hover:text-[#9b9b9b]"}`}
  >
    <Icon size={22} />
    <span className="text-xs font-medium tracking-wide">{label}</span>
  </button>
)

const ToggleButton = ({ enabled, onClick, iconOn: IconOn, iconOff: IconOff, label }: { enabled: boolean; onClick: () => void; iconOn: React.ElementType; iconOff: React.ElementType; label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${enabled ? "bg-[#252525] text-white border border-[#3a3a3a]" : "bg-transparent text-[#6b6b6b] border border-[#1e1e1e] hover:border-[#2e2e2e]"}`}
  >
    {enabled ? <IconOn size={14} /> : <IconOff size={14} />}
    {label}
  </button>
)

const Page = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const workspaceId = params.workspaceId as string
  const folderId = searchParams.get('folderId')

  const [mode, setMode] = useState<RecordMode>("camera")
  const [recordState, setRecordState] = useState<RecordState>("idle")
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [countdown, setCountdown] = useState(3)
  const [duration, setDuration] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const filenameRef = useRef<string>("")
  const previewRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    getUser().then((res) => {
      if (res.status === 200 && res.data) setUserId(res.data.id)
    })
  }, [])

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000")
    return () => { socketRef.current?.disconnect() }
  }, [])

  useEffect(() => {
    if (recordState === "countdown") {
      setCountdown(3)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            startActualRecording()
            return 3
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [recordState])

  useEffect(() => {
    if (recordState === "recording") {
      setDuration(0)
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [recordState])

  const getStream = async (): Promise<MediaStream> => {
    const audioConstraints = micEnabled ? true : false

    if (mode === "screen") {
      const screen = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: audioConstraints })
      return screen
    }

    if (mode === "camera") {
      const camera = await navigator.mediaDevices.getUserMedia({
        video: cameraEnabled,
        audio: audioConstraints,
      })
      return camera
    }

    const [screen, camera] = await Promise.all([
      navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }),
      navigator.mediaDevices.getUserMedia({ video: cameraEnabled, audio: audioConstraints }),
    ])
    const combined = new MediaStream([
      ...screen.getVideoTracks(),
      ...camera.getAudioTracks(),
    ])
    return combined
  }

  const startActualRecording = async () => {
    if (!userId) {
      console.error("User ID not loaded yet")
      setRecordState("idle")
      return
    }

    try {
      const stream = await getStream()
      streamRef.current = stream

      if (previewRef.current) {
        previewRef.current.srcObject = stream
        previewRef.current.muted = true
        previewRef.current.play()
      }

      const filename = `${Date.now()}-${workspaceId}.webm`
      filenameRef.current = filename

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9" })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0 && socketRef.current) {
          e.data.arrayBuffer().then((buffer) => {
            socketRef.current!.emit("video-chunks", {
              chunks: buffer,
              filename,
            })
          })
        }
      }

      recorder.onstop = () => {
        if (socketRef.current) {
          socketRef.current.emit("process-video", {
            filename,
            userId,
            workspaceId,
            folderId: folderId || null,
          })
        }
        stream.getTracks().forEach((t) => t.stop())
      }

      recorder.start(2000)
      setRecordState("recording")
    } catch (err) {
      console.error("Failed to start recording:", err)
      setRecordState("idle")
    }
  }

  const handleStart = () => setRecordState("countdown")

  const handleStop = () => {
    mediaRecorderRef.current?.stop()
    setRecordState("preview")
  }

  const handleRetake = () => {
    setDuration(0)
    setRecordState("idle")
    if (previewRef.current) previewRef.current.srcObject = null
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {folderId && (
          <p className="text-xs text-[#6b6b6b] mb-4 uppercase tracking-widest">
            Saving to folder
          </p>
        )}

        <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-2xl border border-[#1e1e1e] overflow-hidden mb-6 flex items-center justify-center">
          <video
            ref={previewRef}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
          />

          {recordState === "idle" && (
            <div className="flex flex-col items-center gap-3 text-[#3a3a3a] z-10">
              <Video size={48} strokeWidth={1} />
              <p className="text-sm text-[#4a4a4a]">Camera preview will appear here</p>
            </div>
          )}

          {recordState === "countdown" && (
            <div className="flex flex-col items-center gap-2 z-10">
              <span className="text-8xl font-bold tabular-nums text-white opacity-90">{countdown}</span>
              <p className="text-sm text-[#6b6b6b]">Recording starts soon…</p>
            </div>
          )}

          {recordState === "recording" && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono text-white">{formatDuration(duration)}</span>
            </div>
          )}

          {recordState === "preview" && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full z-10">
              <Clock size={13} className="text-[#6b6b6b]" />
              <span className="text-xs font-mono text-[#bdbdbd]">{formatDuration(duration)}</span>
            </div>
          )}
        </div>

        {recordState === "idle" || recordState === "countdown" ? (
          <div className="space-y-6">
            <div>
              <p className="text-xs text-[#6b6b6b] mb-3 uppercase tracking-widest">Recording Mode</p>
              <div className="flex gap-3 flex-wrap">
                <ModeButton active={mode === "camera"} onClick={() => setMode("camera")} icon={Video} label="Camera" />
                <ModeButton active={mode === "screen"} onClick={() => setMode("screen")} icon={Monitor} label="Screen" />
                <ModeButton active={mode === "both"} onClick={() => setMode("both")} icon={Circle} label="Camera + Screen" />
              </div>
            </div>
            <div>
              <p className="text-xs text-[#6b6b6b] mb-3 uppercase tracking-widest">Options</p>
              <div className="flex gap-3 flex-wrap">
                <ToggleButton enabled={micEnabled} onClick={() => setMicEnabled((v) => !v)} iconOn={Mic} iconOff={MicOff} label="Microphone" />
                {(mode === "camera" || mode === "both") && (
                  <ToggleButton enabled={cameraEnabled} onClick={() => setCameraEnabled((v) => !v)} iconOn={Video} iconOff={VideoOff} label="Camera" />
                )}
              </div>
            </div>
            <button
              onClick={handleStart}
              disabled={recordState === "countdown" || !userId}
              className="flex items-center gap-2 bg-white text-black font-medium text-sm px-6 py-3 rounded-full hover:bg-[#e0e0e0] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Circle size={14} className="fill-black" />
              {userId ? "Start Recording" : "Loading..."}
            </button>
          </div>
        ) : recordState === "recording" ? (
          <div className="flex items-center gap-4">
            <button
              onClick={handleStop}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium text-sm px-6 py-3 rounded-full transition-colors duration-200"
            >
              <Square size={14} className="fill-white" />
              Stop Recording
            </button>
            <span className="text-xs text-[#6b6b6b] font-mono">{formatDuration(duration)} elapsed</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-sm text-[#6b6b6b] w-full">Processing your recording…</p>
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 bg-[#252525] border border-[#3a3a3a] text-white text-sm px-5 py-3 rounded-full hover:bg-[#2e2e2e] transition-colors duration-200"
            >
              <RotateCcw size={14} />
              Record Again
            </button>
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#9b9b9b] text-sm px-4 py-3 rounded-full transition-colors duration-200"
            >
              <Trash2 size={14} />
              Discard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page