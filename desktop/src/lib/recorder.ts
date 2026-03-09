import { hidePluginWindow } from "./utils";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";

let videoTransferFileName: string | undefined;
let mediaRecorder: MediaRecorder;
let userId: string;
let activeStreams: MediaStream[] = [];

let socket: ReturnType<typeof io> | null = null;

const getSocket = () => {
  if (!socket || !socket.connected) {
    socket = io(import.meta.env.VITE_SOCKET_URL as string, {
      transports: ["websocket", "polling"], // fallback to polling if websocket fails
      reconnection: true,
    });

    console.log("🔵 Connecting to socket:", import.meta.env.VITE_SOCKET_URL)
    socket.on("connect", () => console.log("🟢 Socket connected", socket?.id))
    socket.on("disconnect", () => console.log("🔴 Socket disconnected"))
    socket.on("connect_error", (err) => console.error("🔴 Socket error:", err.message))
  }
  return socket;
};

const cleanupStreams = () => {
  activeStreams.forEach((stream) => {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  });
  activeStreams = [];
};

export const startRecording = (onSources: {
  screen: string;
  audio: string;
  id: string;
}) => {
  hidePluginWindow(true);
  videoTransferFileName = `${uuid()}-${onSources.id.slice(0, 8)}.webm`;
  mediaRecorder.start(1000);
};

export const onStopRecording = () => mediaRecorder.stop();

export const onDataAvailable = (e: BlobEvent) => {
  getSocket().emit("video-chunks", {
    chunks: e.data,
    filename: videoTransferFileName,
  });
};

const stopRecording = () => {
  hidePluginWindow(false);
  getSocket().emit("process-video", {
    filename: videoTransferFileName,
    userId,
  });
  cleanupStreams();
};

export const selectSources = async (
  onSources: {
    screen: string;
    audio: string;
    id: string;
    preset: "HD" | "SD";
  },
  videoElement: React.RefObject<HTMLVideoElement>,
) => {
  if (onSources && onSources.screen && onSources.audio && onSources.id) {
    getSocket()

    cleanupStreams();
    if (videoElement?.current) {
      videoElement.current.srcObject = null;
    }

    const constraints: any = {
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
      },
    };

    userId = onSources.id;

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    activeStreams.push(stream); 

    //audio and webcam stream
    const audioStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: onSources?.audio
        ? { deviceId: { exact: onSources.audio } }
        : false,
    });
    activeStreams.push(audioStream);

    if (videoElement && videoElement.current) {
      videoElement.current.srcObject = stream;
      await videoElement.current.play();
    }

    const combinedStream = new MediaStream([
      ...stream.getTracks(),
      ...audioStream.getTracks(),
    ]);

    mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm; codecs=vp9",
    });

    mediaRecorder.ondataavailable = onDataAvailable;
    mediaRecorder.onstop = stopRecording;
  }
};

export const destroyRecorder = () => {
  cleanupStreams();
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
//   socket.disconnect();
};
