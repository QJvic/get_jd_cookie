const {ipcRenderer} = require('electron')

ipcRenderer.on('cookieValue', (arg, val) => {
    document.querySelector('#cookieInput').value = val
})