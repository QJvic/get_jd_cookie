const {app, BrowserWindow, session} = require('electron')
const path = require('path')

const filter = {
    urls: ['https://*.jd.com/*']
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            preload: path.join(__dirname, 'setCookieDom.js')
        },
    })

    win.loadFile('index.html')

    return win;
}

app.whenReady().then(() => {
    const win = createWindow()
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        const cookieTxt = details.requestHeaders.Cookie;
        if (cookieTxt) {
            const cookieValue = getCookie(cookieTxt);
            if (cookieValue) {
                win.webContents.send('cookieValue', cookieValue)
            }
        }
        callback({requestHeaders: details.requestHeaders})
    })

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

function getCookie(txt) {
    var CV = txt;
    var CookieValue = CV.match(/pt_pin=.+?;/) + CV.match(/pt_key=.+?;/);
    return CookieValue
}