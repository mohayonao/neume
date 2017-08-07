const url = require("url");
const path = require("path");
const { app, shell, BrowserWindow } = require("electron");
const { spawn } = require("child_process");

let mainWindow = null;
let scsynth = null;

function createWindow() {
  mainWindow = new BrowserWindow();

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.setMenu(null);
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "main.html"),
    protocol: "file",
    slashes: true,
  }));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.on("new-window", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("will-finish-launching", () => {
  scsynth = spawn("scsynth", [ "-u", 57150 ]);
  scsynth.stdout.pipe(process.stdout);
  scsynth.stderr.pipe(process.stderr);
});

app.on("will-quit", () => {
  scsynth.kill();
});
