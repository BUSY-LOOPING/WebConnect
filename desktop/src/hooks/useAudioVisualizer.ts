import { useEffect, useRef, useState } from "react";

export const useAudioVisualizer = (
  audioDeviceId: string | undefined,
  systemAudio: boolean,
) => {
  const [bars, setBars] = useState<number[]>(Array(16).fill(2));
  const animFrameRef = useRef<number>();
  const streamRef = useRef<MediaStream>();

  useEffect(() => {
    if (!audioDeviceId && !systemAudio) {
      setBars(Array(16).fill(2));
      return;
    }

    let ctx: AudioContext;

    const setup = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
          video: false,
        });

        streamRef.current = stream;
        ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteFrequencyData(data);
          setBars(
            Array.from(data.slice(0, 16)).map((v) =>
              Math.max(2, (v / 255) * 100),
            ),
          );
          animFrameRef.current = requestAnimationFrame(tick);
        };

        animFrameRef.current = requestAnimationFrame(tick);
      } catch {
        setBars(Array(16).fill(2));
      }
    };

    setup();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current)
        streamRef.current.getTracks().forEach((t) => t.stop());
      ctx?.close();
    };
  }, [audioDeviceId, systemAudio]);

  return bars;
};