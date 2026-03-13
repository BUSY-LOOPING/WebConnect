import { app as r, ipcMain as a, desktopCapturer as p, BrowserWindow as l } from "electron";
import { fileURLToPath as h } from "node:url";
import t from "node:path";
const c = t.dirname(h(import.meta.url));
process.env.APP_ROOT = t.join(c, "..");
const i = process.env.VITE_DEV_SERVER_URL, v = t.join(process.env.APP_ROOT, "dist-electron"), u = i ? t.join(process.env.APP_ROOT, "dist") : t.join(r.getAppPath(), "dist");
process.env.VITE_PUBLIC = i ? t.join(process.env.APP_ROOT, "public") : u;
let n, e;
function d() {
  n = new l({
    // titleBarStyle: "hidden",
    maxWidth: 600,
    height: 400,
    minWidth: 300,
    // minWidth: 300,
    // minHeight: 600,
    hasShadow: !1,
    frame: !1,
    transparent: !0,
    alwaysOnTop: !0,
    focusable: !0,
    icon: t.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: t.join(c, "preload.mjs"),
      nodeIntegration: !0,
      contextIsolation: !0,
      devTools: !0
    }
  }), e = new l({
    width: 300,
    height: 200,
    minWidth: 200,
    maxWidth: 400,
    maxHeight: 500,
    frame: !1,
    hasShadow: !1,
    transparent: !0,
    alwaysOnTop: !0,
    focusable: !0,
    icon: t.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: t.join(c, "preload.mjs"),
      nodeIntegration: !0,
      contextIsolation: !0,
      devTools: !0
    }
  }), n.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), n.setAlwaysOnTop(!0, "screen-saver", 1), e.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), e.setAlwaysOnTop(!0, "screen-saver", 1), n.webContents.on("did-finish-load", () => {
    n == null || n.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), n == null || n.webContents.openDevTools({ mode: "detach" });
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    ), e == null || e.webContents.openDevTools({ mode: "detach" });
  }), i ? (n.loadURL(i), e.loadURL(`${i}/studio.html`)) : (n.loadURL("webconnect://app/index.html"), e.loadURL("webconnect://app/studio.html"));
}
r.on("window-all-closed", () => {
  process.platform !== "darwin" && (r.quit(), n = null);
});
a.on("closeApp", () => {
  process.platform !== "darwin" && (r.quit(), n = null, e = null);
});
a.handle("getSources", async () => {
  try {
    return await p.getSources({
      thumbnailSize: { height: 100, width: 150 },
      fetchWindowIcons: !0,
      types: ["window", "screen"]
    });
  } catch (o) {
    throw console.error("Error getting sources:", o), o;
  }
});
a.on("media-sources", (o, s) => {
  e == null || e.webContents.send("profile-received", s);
});
a.on("resize-studio", (o, s) => {
  s.shrink && (e == null || e.setSize(400, 100)), s.shrink || e == null || e.setSize(400, 250);
});
a.on("hide-plugin", (o, s) => {
  n == null || n.webContents.send("hide-plugin", s);
});
r.on("activate", () => {
  l.getAllWindows().length === 0 && d();
});
r.whenReady().then(() => {
  d();
});
export {
  v as MAIN_DIST,
  u as RENDERER_DIST,
  i as VITE_DEV_SERVER_URL
};
