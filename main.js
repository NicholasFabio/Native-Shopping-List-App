const electron = require('electron');
const url = require('url');
const path = require('path');

const {app,BrowserWindow,Menu, ipcMain} = electron ;

// SET ENV
process.env.NODE_ENV = 'development';

// Mac OS Dock Menu
const dockMenu = Menu.buildFromTemplate([
    {
    label: 'New Window',
        click () { console.log('New Window') }
    }, {
        label: 'New Window with Settings',
        submenu: [
        { label: 'Basic' },
        { label: 'Pro' }
        ]
    },
    { label: 'New Command...' }
])
app.dock.setMenu(dockMenu)

// Create menu template
const template = [
// { role: 'appMenu' }
...(process.platform == 'darwin' ? [{
    label: app.getName(),
    submenu: [
    { role: 'about' },
    { type: 'separator' },
    { role: 'services' },
    { type: 'separator' },
    { role: 'hide' },
    { role: 'hideothers' },
    { role: 'unhide' },
    { type: 'separator' },
    { role: 'quit' }
    ]
}] : []),
// { role: 'fileMenu' }
{
    label: 'File',
    submenu: [
        {
            label:'Add Item',
            click(){
                createAddWindow();
            }
        },
        {
            label:'Clear Items',
            click(){
                mainWindow.webContents.send('item:clear');
            }
        },
        { role: 'close' }
    ]
},
// { role: 'editMenu' }
{
    label: 'Edit',
    submenu: [
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    ...(process.platform == 'darwin' ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
        label: 'Speech',
        submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
        ]
        }
    ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
    ])
    ]
},
// { role: 'viewMenu' }
{
    label: 'View',
    submenu: [
    { role: 'reload' },
    { role: 'forcereload' },
    { role: 'toggledevtools' },
    { type: 'separator' },
    { role: 'resetzoom' },
    { role: 'zoomin' },
    { role: 'zoomout' },
    { type: 'separator' },
    { role: 'togglefullscreen' }
    ]
},
// { role: 'windowMenu' }
{
    label: 'Window',
    submenu: [
    { role: 'minimize' },
    { role: 'zoom' },
    ...(process.platform == 'darwin' ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
    ] : [
        { role: 'close' }
    ])
    ]
},
{
    role: 'help',
    submenu: [
    {
        label: 'Learn More',
        click: async () => {
        const { shell } = require('electron')
        await shell.openExternal('https://electronjs.org')
        }
    }
    ]
}
]

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function(){
    // Create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            icon : 'file://${__dirname}/assets/images/logo.png'
        }
    });
    // Load html in window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file:',
        slashes:true
    }));
    // Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(template);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});

// Handle add item window
function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 300,
    height:200,
    title:'Add Shopping List Item',
    webPreferences: {
        nodeIntegration: true
    },
    icon : 'file://${__dirname}/assets/images/logo.png'
    });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'newItem.html'),
        protocol: 'file:',
        slashes:true
    }));
    // Handle garbage collection
    addWindow.on('close', function(){
        addWindow = null;
    });
}

// Catch item:add
ipcMain.on('item:add', function(e, item){
    mainWindow.webContents.send('item:add', item);
    addWindow.close(); 
    // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
    //addWindow = null;
});
