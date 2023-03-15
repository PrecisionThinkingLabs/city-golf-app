const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const { Client } = require("ssh2");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const indexPath = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  console.log("Loading index file:", indexPath); // Add this line

  win.loadURL(indexPath);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle(
  "ssh-connect",
  async (event, { hostname, username, password }) => {
    return new Promise((resolve, reject) => {
      const connection = new Client();

      connection
        .on("ready", () => {
          const command = 'open -a "Google Chrome"';
          connection.exec(command, (err, stream) => {
            if (err) {
              reject(`Error executing command: ${err}`);
              connection.end();
              return;
            }

            let output = "";
            stream.on("data", (data) => {
              output += data.toString();
            });

            stream.stderr.on("data", (data) => {
              output += data.toString();
            });

            stream.on("close", () => {
              connection.end();
            });

            resolve(output);
          });
        })
        .on("error", (err) => {
          reject(`Error connecting to SSH: ${err}`);
        })
        .connect({
          host: hostname,
          port: 22,
          username: username,
          password: password,
        });
    });
  }
);
