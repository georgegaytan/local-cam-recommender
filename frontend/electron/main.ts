import { app, BrowserWindow } from 'electron';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import os from 'os';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null;

const PY_DIST_FOLDER = 'backend-dist'; // Name of folder where exe is located in resources
const PY_EXE = 'local-cam-api.exe'; // Name of the executable

const isDev = !app.isPackaged;

function getBackendPath(): string {
    if (isDev) {
        // In Dev, we assume we are running from 'frontend' folder, and backend is at '../backend'
        // We will spawn the python interpreter.
        // NOTE: This assumes 'python' is in PATH.
        return 'python';
    } else {
        // In Prod, the exe is in resources/backend-dist/local-cam-api.exe
        // 'process.resourcesPath' points to the resources folder.
        return path.join(process.resourcesPath, PY_DIST_FOLDER, PY_EXE);
    }
}

function startBackend() {
    const backendPath = getBackendPath();
    console.log(`Starting backend from: ${backendPath}`);

    if (isDev) {
        // Spawn python uvicorn
        // We need to resolve the backend folder path relative to here
        // electron main is likely running from root or frontend.
        // CWD for electron in dev is usually the package.json folder (frontend).
        const backendScript = path.join(__dirname, '../../backend/run.py');
        console.log(`Backend script: ${backendScript}`);

        backendProcess = spawn('python', [backendScript], {
            cwd: path.join(__dirname, '../../backend'),
            stdio: 'inherit' // Pipe output to main console
        });
    } else {
        // Spawn the compiled exe
        backendProcess = spawn(backendPath, [], {
            stdio: 'inherit'
        });
    }

    backendProcess.on('error', (err) => {
        console.error('Failed to start backend:', err);
    });

    backendProcess.on('exit', (code, signal) => {
        console.log(`Backend exited with code ${code} and signal ${signal}`);
    });
}

function stopBackend() {
    if (backendProcess) {
        console.log('Stopping backend...');
        backendProcess.kill();
        backendProcess = null;
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For simple IPC if needed, ideally use preload
        },
    });

    if (isDev) {
        // Wait a bit for React to start? Or just load localhost
        // concurrently handles starting both, but we assume React is on 5173
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // In prod, load index.html from dist
        // __dirname in prod usually points to resources/app/dist/electron-main or similar
        // We need to verify where vite builds to.
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.on('ready', () => {
    startBackend();
    // Give backend a moment to start (optional, but UI might fail to fetch immediately otherwise)
    setTimeout(createWindow, 1000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('quit', () => {
    stopBackend();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
