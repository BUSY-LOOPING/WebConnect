import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const onCloseApp = () => window.ipcRenderer.send("closeApp");

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL,
});

export const fetchUserProfile = async (clerkid: string) => {
  const response = await httpClient.get(`/auth/${clerkid}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// lib/utils.ts
export const getMediaResources = async () => {
  try {
    const displays = await window.ipcRenderer.invoke("getSources");
    //console.log("🟡 AFTER invoke - displays:", displays);

    const enumerateDevices =
      await window.navigator.mediaDevices.enumerateDevices();
    const audioInputs = enumerateDevices.filter(
      (device) => device.kind === "audioinput",
    );

    return { displays, audio: audioInputs };
  } catch (error) {
    console.error("🟡 Error in getMediaResources:", error);
    throw error;
  }
};

export const updateStudioSettings = async (
  id: string,
  screen: string,
  audio: string,
  preset: "HD" | "SD",
) => {
    console.log('updateStudioSettings called')
  const response = await httpClient.post(
    `/studio/${id}`,
    {
      screen,
      audio,
      preset,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response;
};

export const hidePluginWindow = (state: boolean) => {
  window.ipcRenderer.send("hide-plugin", { state });
};

export const videoRecordingTime = (ms:number) => {
    const second = Math.floor((ms / 1000) % 60).toString().padStart(2, '0')
    const minute = Math.floor((ms / 1000 / 60) % 60).toString().padStart(2, '0')
    const hour = Math.floor((ms / 1000 / 60 / 60)).toString().padStart(2, '0')

    return {length: `${hour}:${minute}:${second}`, minute}
}

export const resizeWindow = (shrink: boolean) => {
    window.ipcRenderer.send('resize-studio', {shrink})
}