/* globals customElements */

import { ipcRenderer } from 'electron'

// setup
document.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('app-window:ready')
})

class ShellWindowUI {
}

customElements.define('shell-window', ShellWindowUI)