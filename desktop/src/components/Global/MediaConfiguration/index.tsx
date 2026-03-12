import { SourceDeviceStateProps } from "@/hooks/useMediaResouce";
import { useStudioSettings } from "@/hooks/useStudioSettings";
import { Loader } from "../Loader";
import AudioVisualizer from "../AudioVisualizer";
import { Headphones, Monitor, Settings2, Volume2, VolumeX } from "lucide-react";
import { useEffect } from "react";

type Props = {
  state: SourceDeviceStateProps;
  onToggleSystemAudio: () => void;
  user:
    | ({
        subscription: { plan: "PRO" | "FREE" } | null;
        studio: {
          id: string;
          screen: string | null;
          mic: string | null;
          camera: string | null;
          preset: "HD" | "SD";
          userId: string | null;
        } | null;
      } & {
        id: string;
        email: string;
        firstname: string | null;
        lastname: string | null;
        createdAt: Date;
        clerkid: string;
      })
    | null;
};

const MediaConfiguration = ({ state, user, onToggleSystemAudio }: Props) => {
  const { isPending, onPreset, register } = useStudioSettings(
    user.id,
    state.systemAudio,
    user?.studio?.screen || state.displays?.[0]?.id,
    user?.studio?.mic || state.audioInputs?.[0]?.deviceId,
    user?.studio?.preset,
    user?.subscription?.plan,
  );

  const activeScreen = state.displays?.find(
    (screen) => screen.id === user?.studio?.screen,
  );
  const activeAudio = state.audioInputs?.find(
    (device) => device.deviceId === user?.studio?.mic,
  );

  if (!user || !state.displays?.length || !state.audioInputs?.length) {
    return <Loader />;
  }

  const currentAudioId =
    activeAudio?.deviceId ?? state.audioInputs?.[0]?.deviceId;


  return (
    <form className="flex h-full relative w-full flex-col gap-y-5">
      {isPending && (
        <div className="fixed z-50 w-full top-0 left-0 right-0 bottom-0 rounded-2xl h-full bg-black/80 flex justify-center items-center">
          <Loader />
        </div>
      )}

      <div className="flex gap-x-5 justify-center items-center w-full overflow-hidden">
        <Monitor
          fill="#575655"
          color="#575655"
          className="shrink-0"
          size={36}
        />
        <div className="relative w-full min-w-0 overflow-hidden">
          <select
            {...register("screen")}
            className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full max-w-full truncate"
          >
            {state.displays?.map((display, key) => (
              <option
                // selected={activeScreen && activeScreen.id === display.id}
                className="bg-[#171717] cursor-pointer"
                key={key}
                value={display.id}
              >
                {display.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-x-5 justify-center items-center w-full">
        <Headphones color="#575655" size={36} />
        <select
          {...register("audio")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          {state.audioInputs?.map((device, key) => (
            <option
              value={device.deviceId}
              className="bg-[#171717] cursor-pointer"
              key={key}
            >
              {device.label}
            </option>
          ))}
        </select>
      </div>

      <AudioVisualizer
        audioDeviceId={currentAudioId}
        systemAudio={state.systemAudio}
      />

      <div
        onClick={onToggleSystemAudio}
        className="flex items-center justify-between w-full cursor-pointer px-1 select-none"
      >
        <div className="flex gap-x-3 items-center">
          {state.systemAudio ? (
            <Volume2 color="#575655" size={28} />
          ) : (
            <VolumeX color="#575655" size={28} />
          )}
          <span className="text-[#575655] text-sm">System Audio</span>
        </div>
        <div className="relative w-11 h-6 rounded-full transition-colors duration-200 bg-[#2a2a2a]">
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-[#575655] transition-all duration-200 ${
              state.systemAudio ? "left-6" : "left-1"
            }`}
          />
        </div>
      </div>

      <div className="flex gap-x-5 justify-center items-center">
        <Settings2 color="#575655" size={36} />
        <select
          {...register("preset")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          <option
            disabled={user?.subscription?.plan === "FREE"}
            // selected={onPreset === "HD" || user?.studio?.preset === "HD"}
            value="HD"
            className="bg-[#171717] cursor-pointer"
          >
            1080p{" "}
            {user?.subscription?.plan === "FREE" && "(Upgrade to PRO plan)"}
          </option>
          <option
            // selected={onPreset === "SD" || user?.studio?.preset === "SD"}
            value="SD"
            className="bg-[#171717] cursor-pointer"
          >
            720p
          </option>
        </select>
      </div>
    </form>
  );
};

export default MediaConfiguration;
