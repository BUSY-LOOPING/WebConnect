import { useAudioVisualizer } from "@/hooks/useAudioVisualizer";

type Props = {
  audioDeviceId: string | undefined;
  systemAudio: boolean;
};

const AudioVisualizer = ({ audioDeviceId, systemAudio }: Props) => {
  const bars = useAudioVisualizer(audioDeviceId, systemAudio);

  return (
    <div className="flex items-end justify-between h-6 w-full gap-x-[2px] px-1">
      {bars.map((height, i) => (
        <div
          key={i}
          className="flex-1 rounded-full bg-[#575655] transition-all duration-75"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;