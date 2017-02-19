'use strict';

// Imports
const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
let server;

function createWindow() {
	server = require('child_process').spawn('py', ['-3', '-m', 'pynetworktables2js', '--robot 10.33.22.2', '--port 3322']);

	mainWindow = new BrowserWindow({
		x: 0,
		y: 0,
		width: 1366,
		height: 530,
		icon: "images/logo.ico",
		show: false
	});

	mainWindow.setPosition(0, 0);
	mainWindow.loadURL('http://localhost:3322');

	mainWindow.once('ready-to-show', function() {
		mainWindow.loadURL('http://localhost:3322');
		mainWindow.once('ready-to-show', function() {
			mainWindow.show();
		});
	});

	mainWindow.setMenu(null);
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	app.quit();
});

app.on('quit', function() {
	console.log('Application quit. Killing tornado server.');

	// Kill tornado server child process.
	server.kill('SIGINT');
});

app.on('activate', function() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});
