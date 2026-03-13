import {
  app,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  session,
  protocol,
  net, shell
} from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "dist")
  : path.join(app.getAppPath(), "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let studio: BrowserWindow | null;
// let floatingWebCam: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    // titleBarStyle: "hidden",
    maxWidth: 600,
    height: 400,
    minWidth: 300,
    // minWidth: 300,
    // minHeight: 600,
    hasShadow: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: true,
      contextIsolation: true,
      devTools: true,
    },
  });

  studio = new BrowserWindow({
    width: 300,
    height: 200,
    minWidth: 200,
    maxWidth: 400,
    maxHeight: 500,
    frame: false,
    hasShadow: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: true,
      contextIsolation: true,
      devTools: true,
    },
  });

  //   floatingWebCam = new BrowserWindow({
  //     width: 400,
  //     height: 200,
  //     minHeight: 70,
  //     maxHeight: 400,
  //     minWidth: 300,
  //     maxWidth: 400,
  //     frame: false,
  //     transparent: true,
  //     alwaysOnTop: true,
  //     focusable: false,
  //     icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
  //     webPreferences: {
  //       preload: path.join(__dirname, "preload.mjs"),
  //       nodeIntegration: false,
  //       contextIsolation: true,
  //       devTools: true,
  //     },
  //   });

  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver", 1);
  studio.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studio.setAlwaysOnTop(true, "screen-saver", 1);

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
    win?.webContents.openDevTools({ mode: "detach" }); // opens as separate window
  });

  studio.webContents.on("did-finish-load", () => {
    studio?.webContents.send(
      "main-process-message",
      new Date().toLocaleString(),
    );
    studio?.webContents.openDevTools({ mode: "detach" });
  });

//   win.webContents.on("will-navigate", (event, url) => {
//     if (url.startsWith("https://webconnect.dhruvyadav.ca")) {
//       event.preventDefault();

//       // Extract Clerk's session params from the redirect URL
//       const parsed = new URL(url);
//       const clerkParams = parsed.searchParams.toString(); // __clerk_db_jwt, __clerk_status etc

//       console.log("clerk params", clerkParams);
//       if (VITE_DEV_SERVER_URL) {
//         const target = clerkParams
//           ? `${VITE_DEV_SERVER_URL}?${clerkParams}`
//           : VITE_DEV_SERVER_URL;
//         win?.loadURL(target);
//       } else {
//         const target = clerkParams
//           ? path.join(RENDERER_DIST, `index.html?${clerkParams}`)
//           : path.join(RENDERER_DIST, `index.html`);
//         win?.loadURL(target);
//       }
//     }
//   });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    studio.loadURL(`${VITE_DEV_SERVER_URL}/studio.html`);
  } else {
    // win.loadFile(path.join(RENDERER_DIST, "index.html"));
    // studio.loadFile(path.join(RENDERER_DIST, "studio.html"));
    win.loadURL("webconnect://app/index.html");
    studio.loadURL("webconnect://app/studio.html");
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

// ipcMain.on("set-ignore-mouse-events", (event, ignore) => {
//   const win = BrowserWindow.fromWebContents(event.sender);
//   win?.setIgnoreMouseEvents(ignore, { forward: true });
// });

ipcMain.on("closeApp", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    // floatingWebCam = null;
  }
});

ipcMain.handle("getSources", async () => {
  //console.log('🔴 getSources handler called!');
  try {
    const data = await desktopCapturer.getSources({
      thumbnailSize: { height: 100, width: 150 },
      fetchWindowIcons: true,
      types: ["window", "screen"],
    });

    //console.log('DISPLAYS📺', data);
    return data;
  } catch (error) {
    console.error("Error getting sources:", error);
    throw error;
  }
});

ipcMain.on("media-sources", (_, payload) => {
  //console.log('profile-received main.ts payload = ', payload)
  studio?.webContents.send("profile-received", payload);
});

ipcMain.on("resize-studio", (_, payload) => {
  //console.log(event)
  if (payload.shrink) {
    studio?.setSize(400, 100);
  }
  if (!payload.shrink) {
    studio?.setSize(400, 250);
  }
});

ipcMain.on("hide-plugin", (_, payload) => {
  //console.log(event)
  win?.webContents.send("hide-plugin", payload);
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
// protocol.registerSchemesAsPrivileged([
//   {
//     scheme: "webconnect",
//     privileges: {
//       standard: true,
//       secure: true,
//       supportFetchAPI: true,
//       allowServiceWorkers: true,
//       corsEnabled: true,
//     },
//   },
// ]);

app.whenReady().then(() => {
//   protocol.handle("webconnect", (request) => {
//     const url = request.url.replace("webconnect://app/", "");
//     const filePath = path.join(
//       __dirname,
//       "..",
//       "dist",
//       decodeURIComponent(url) || "index.html"
//     );
//     return net.fetch(`file://${filePath}`);
//   });

  createWindow();
});