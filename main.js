import { app, BrowserWindow } from "electron";
import fs from "fs";
import path from "path";
import { startServer, setEntriesDir } from "./index.js";

var win;

function migrateEntries(entriesDir) {
    const bundledEntries = path.join(app.getAppPath(), "public", "entries");
    if (fs.existsSync(bundledEntries)) {
        for (const file of fs.readdirSync(bundledEntries)) {
            const dest = path.join(entriesDir, file);
            if (!fs.existsSync(dest)) {
                fs.copyFileSync(path.join(bundledEntries, file), dest);
            }
        }
    }
}

async function createWindow() {
    const entriesDir = path.join(app.getPath("userData"), "entries");
    fs.mkdirSync(entriesDir, { recursive: true });
    migrateEntries(entriesDir);
    setEntriesDir(entriesDir);

    const port = await startServer();

    win = new BrowserWindow({
        width: 1000,
        height: 800,
        autoHideMenuBar: true,
    });

    win.loadURL(`http://localhost:${port}`);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});