import { getMediaResources } from "@/lib/utils";
import { useReducer } from "react";

export type SourceDeviceStateProps = {
  displays?: {
    appIcon: null;
    display_id: string;
    id: string;
    name: string;
    thumbnail: unknown[];
  }[];
  audioInputs?: {
    deviceId: string;
    kind: string;
    label: string;
    groupId: string;
  }[];
  systemAudio: boolean;
  error?: string | null;
  isPending?: boolean;
};

type DisplayDeviceActionProps =
  | { type: "GET_DEVICES"; payload: Omit<SourceDeviceStateProps, "systemAudio"> }
  | { type: "TOGGLE_SYSTEM_AUDIO" };

export const useMediaResource = () => {
  const [state, action] = useReducer(
    (state: SourceDeviceStateProps, action: DisplayDeviceActionProps) => {
      switch (action.type) {
        case "GET_DEVICES":
          return { ...state, ...action.payload };
        case "TOGGLE_SYSTEM_AUDIO":
          return { ...state, systemAudio: !state.systemAudio };
        default:
          return state;
      }
    },
    {
      displays: [],
      audioInputs: [],
      systemAudio: false,
      error: null,
      isPending: false,
    },
  );

  const fetchMediaResources = () => {
    action({ type: "GET_DEVICES", payload: { isPending: true } });
    getMediaResources()
      .then((sources) => {
        action({
          type: "GET_DEVICES",
          payload: {
            displays: sources.displays,
            audioInputs: sources.audio,
            isPending: false,
          },
        });
      })
      .catch((error) => {
        action({
          type: "GET_DEVICES",
          payload: { error: error.message, isPending: false },
        });
      });
  };

  const toggleSystemAudio = () => action({ type: "TOGGLE_SYSTEM_AUDIO" });

  return { state, fetchMediaResources, toggleSystemAudio };
};
