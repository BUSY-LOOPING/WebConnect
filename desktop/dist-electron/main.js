import { app as t, ipcMain as a, desktopCapturer as h, BrowserWindow as c } from "electron";
import { fileURLToPath as u } from "node:url";
import o from "node:path";
const p = o.dirname(u(import.meta.url));
process.env.APP_ROOT = o.join(p, "..");
const i = process.env.VITE_DEV_SERVER_URL, g = o.join(process.env.APP_ROOT, "dist-electron"), l = i ? o.join(process.env.APP_ROOT, "dist") : o.join(t.getAppPath(), "dist");
process.env.VITE_PUBLIC = i ? o.join(process.env.APP_ROOT, "public") : l;
console.log("RENDERER_DIST:", l);
console.log("app.getAppPath():", t.getAppPath());
let n, e;
function d() {
  n = new c({
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
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: o.join(p, "preload.mjs"),
      nodeIntegration: !0,
      contextIsolation: !0,
      devTools: !0
    }
  }), e = new c({
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
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: o.join(p, "preload.mjs"),
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
  }), i ? (n.loadURL(i), e.loadURL(`${i}/studio.html`)) : (n.loadFile(o.join(l, "index.html")), e.loadFile(o.join(l, "studio.html")));
}
t.on("window-all-closed", () => {
  process.platform !== "darwin" && (t.quit(), n = null);
});
a.on("closeApp", () => {
  process.platform !== "darwin" && (t.quit(), n = null, e = null);
});
a.handle("getSources", async () => {
  try {
    return await h.getSources({
      thumbnailSize: { height: 100, width: 150 },
      fetchWindowIcons: !0,
      types: ["window", "screen"]
    });
  } catch (s) {
    throw console.error("Error getting sources:", s), s;
  }
});
a.on("media-sources", (s, r) => {
  e == null || e.webContents.send("profile-received", r);
});
a.on("resize-studio", (s, r) => {
  r.shrink && (e == null || e.setSize(400, 100)), r.shrink || e == null || e.setSize(400, 250);
});
a.on("hide-plugin", (s, r) => {
  n == null || n.webContents.send("hide-plugin", r);
});
t.on("activate", () => {
  c.getAllWindows().length === 0 && d();
});
t.whenReady().then(d);
export {
  g as MAIN_DIST,
  l as RENDERER_DIST,
  i as VITE_DEV_SERVER_URL
};
