import { BrowserWindow, dialog, Menu, MenuItem, MenuItemConstructorOptions } from 'electron';
import * as roomconvert from '../common/roomconvert';

const isMac = process.platform === 'darwin';

async function open(m: MenuItem, window?: BrowserWindow) {
    if (!window) {
        // mac....
        return;
    }

    const result = await dialog.showOpenDialog(window, {
        filters: [
            { name: 'Room Files', extensions: [ 'xml' ] }
        ],
        properties: [ 'openFile' ]
    });
    if (result.canceled || !result.filePaths[0]) {
        return;
    }

    const path = result.filePaths[0];
    const file = await roomconvert.xmlToCommon(path);

    window.webContents.send('file-open', {
        path,
        rooms: file,
    });
}

const template: Array<MenuItemConstructorOptions | MenuItem> = [
  //{ role: 'appMenu' },
  // { role: 'fileMenu' }
  {
    label: '&File',
    submenu: [
        { label: 'New',             accelerator: 'CommandOrControl+N' },
        { label: 'Open (XML)...',   accelerator: 'CommandOrControl+O', click: open },
        { label: 'Import (STB)...', accelerator: 'CommandOrControl+Shift+O' },
        { type:                     'separator' },
        { label: 'Save',            accelerator: 'CommandOrControl+S' },
        { label: 'Save As...',      accelerator: 'CommandOrControl+Shift+S' },
        { label: 'Export to STB',   accelerator: 'Alt+Shift+S' },
        { type:                     'separator' },
        { label: 'Copy Screenshot to Clipboard',   accelerator: 'F10' },
        { label: 'Save Screenshot to File...',     accelerator: 'CommandOrControl+F10' },
        { type:                     'separator' },
        { label: 'Set Resource Paths...' }, // dialog
        { label: 'Set Hooks...' }, // dialog
        { label: 'Autogenerate mod content (discouraged)', type: 'checkbox' }, // dialog

        // recent files

        { type:                     'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
//   {
//     label: '&Edit',
//     submenu: [
//       { role: 'undo' },
//       { role: 'redo' },
//       { type: 'separator' },
//       { role: 'cut' },
//       { role: 'copy' },
//       { role: 'paste' },
//       ...(isMac ? [
//         { role: 'pasteAndMatchStyle' },
//         { role: 'delete' },
//         { role: 'selectAll' },
//         { type: 'separator' },
//         {
//           label: 'Speech',
//           submenu: [
//             { role: 'startSpeaking' },
//             { role: 'stopSpeaking' }
//           ]
//         }
//       ] : [
//         { role: 'delete' },
//         { type: 'separator' },
//         { role: 'selectAll' }
//       ])
//     ]
//   },
//   // { role: 'viewMenu' }
//   {
//     label: 'View',
//     submenu: [
//       { role: 'reload' },
//       { role: 'forceReload' },
//       { role: 'toggleDevTools' },
//       { type: 'separator' },
//       { role: 'resetZoom' },
//       { role: 'zoomIn' },
//       { role: 'zoomOut' },
//       { type: 'separator' },
//       { role: 'togglefullscreen' }
//     ]
//   },
//   // { role: 'windowMenu' }
//   {
//     label: 'Window',
//     submenu: [
//       { role: 'minimize' },
//       { role: 'zoom' },
//       ...(isMac ? [
//         { type: 'separator' },
//         { role: 'front' },
//         { type: 'separator' },
//         { role: 'window' }
//       ] : [
//         { role: 'close' }
//       ])
//     ]
//   },
//   {
//     role: 'help',
//     submenu: [
//       {
//         label: 'Learn More',
//         click: async () => {
//           const { shell } = require('electron')
//           await shell.openExternal('https://electronjs.org')
//         }
//       }
//     ]
//   }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);