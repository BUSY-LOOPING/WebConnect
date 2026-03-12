import { hidePluginWindow } from "./utils";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";

let videoTransferFileName: string | undefined;
let mediaRecorder: MediaRecorder;
let userId: string;
let activeStreams: MediaStream[] = [];
let isRecording = false;

// Create socket ONCE at module load, not lazily
const socket = io(import.meta.env.VITE_SOCKET_URL as string, {
  transports: ["websocket"],       // Don't fall back to polling — it's slower and breaks large binary transfers
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  pingInterval: 10000,             // Keep-alive ping every 10s
  pingTimeout: 5000,               // Consider disconnected after 5s no pong
  autoConnect: true,
});

socket.on("connect", () => console.log("🟢 Socket connected", socket.id));
socket.on("disconnect", (reason) => {
  console.warn("🔴 Socket disconnected:", reason);
  // "transport close" or "ping timeout" = network issue, will auto-reconnect
  // "io server disconnect" = server kicked us intentionally
});
socket.on("connect_error", (err) => console.error("🔴 Socket error:", err.message));

let chunkQueue: Array<{ chunks: Blob; filename: string }> = [];

socket.on("connect", () => {
  // Flush any queued chunks after reconnection
  if (chunkQueue.length > 0) {
    console.log(`🔄 Flushing ${chunkQueue.length} queued chunks`);
    chunkQueue.forEach((item) => {
      socket.emit("video-chunks", item);
    });
    chunkQueue = [];
  }
});

const cleanupStreams = () => {
  activeStreams.forEach((stream) => {
    stream.getTracks().forEach((track) => track.stop());
  });
  activeStreams = [];
};

export const startRecording = (onSources: {
  screen: string;
  audio: string;
  id: string;
}) => {
  hidePluginWindow(true);
  isRecording = true;
  videoTransferFileName = `${uuid()}-${onSources.id.slice(0, 8)}.webm`;
  mediaRecorder.start(1000);
};

export const onStopRecording = () => {
  isRecording = false;
  mediaRecorder.stop();
};

export const onDataAvailable = (e: BlobEvent) => {
  if (!e.data || e.data.size === 0) return; // Skip empty chunks

  const payload = {
    chunks: e.data,
    filename: videoTransferFileName,
  };

  if (socket.connected) {
    socket.emit("video-chunks", payload);
  } else {
    // Buffer chunks during brief disconnects instead of dropping them
    console.warn("⚠️ Socket disconnected, queuing chunk");
    chunkQueue.push(payload);
  }
};

const stopRecording = () => {
  hidePluginWindow(false);

  const emitProcessVideo = () => {
    socket.emit("process-video", { filename: videoTransferFileName, userId });
  };

  // Wait for queue to flush before signaling processing
  if (chunkQueue.length > 0) {
    socket.once("connect", () => {
      setTimeout(emitProcessVideo, 500); // Small delay to ensure chunks land first
    });
  } else {
    emitProcessVideo();
  }

  cleanupStreams();
};

export const selectSources = async (
  onSources: {
    screen: string;
    audio: string;
    id: string;
    preset: "HD" | "SD";
    systemAudio: boolean;
  },
  videoElement: React.RefObject<HTMLVideoElement>,
) => {
    // onSources.systemAudio = true;
    console.log('system audio' , onSources.systemAudio)
  if (onSources && onSources.screen && onSources.audio && onSources.id) {
    cleanupStreams();
    chunkQueue = [];

    if (videoElement?.current) {
      videoElement.current.srcObject = null;
    }

    userId = onSources.id;

    const videoStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: onSources.screen,
          minWidth: onSources.preset === "HD" ? 1920 : 1280,
          maxWidth: onSources.preset === "HD" ? 1920 : 1280,
          minHeight: onSources.preset === "HD" ? 1080 : 720,
          maxHeight: onSources.preset === "HD" ? 1080 : 720,
          frameRate: 30,
        },
      } as any,
    });
    activeStreams.push(videoStream);

    const micStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: onSources.audio ? { deviceId: { exact: onSources.audio } } : false,
    });
    activeStreams.push(micStream);

    const audioTracks = [...micStream.getAudioTracks()];

    if (true) {
      try {
        const systemStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: onSources.screen,
            },
          } as any,
          video: false,
        });
        activeStreams.push(systemStream);

        const ctx = new AudioContext();
        const destination = ctx.createMediaStreamDestination();

        const micSource = ctx.createMediaStreamSource(
          new MediaStream(micStream.getAudioTracks()),
        );
        const systemSource = ctx.createMediaStreamSource(
          new MediaStream(systemStream.getAudioTracks()),
        );

        const micGain = ctx.createGain();
        const systemGain = ctx.createGain();
        micGain.gain.value = 1.0;
        systemGain.gain.value = 1.0;

        micSource.connect(micGain).connect(destination);
        systemSource.connect(systemGain).connect(destination);

        audioTracks.length = 0;
        audioTracks.push(...destination.stream.getAudioTracks());
      } catch (err) {
        console.warn("⚠️ System audio capture failed, falling back to mic only:", err);
      }
    }

    if (videoElement?.current) {
      videoElement.current.srcObject = videoStream;
      await videoElement.current.play();
    }

    const combinedStream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...audioTracks,
    ]);

    const mimeType = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
      ? "video/webm; codecs=vp9"
      : "video/webm";

    videoTransferFileName = `${uuid()}-${onSources.id.slice(0, 8)}.webm`;

    mediaRecorder = new MediaRecorder(combinedStream, { mimeType });
    mediaRecorder.ondataavailable = onDataAvailable;
    mediaRecorder.onstop = stopRecording;
  }
};

export const destroyRecorder = () => {
  cleanupStreams();
  chunkQueue = [];
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
};