import { LitElement, html, css } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { pluralize, toNiceDomain } from '../../../app-stdlib/js/strings.js'
import viewCSS from '../../css/views/general.css.js'

class NetworkView extends LitElement {
  static get properties () {
    return {
      networkStatus: {type: Array}
    }
  }

  static get styles () {
    return [viewCSS, css`
    :host {
      max-width: none;
    }

    table {
      width: 100%;
    }

    td {
      border-top: 1px solid #dde;
      padding: 12px 16px;
      font-family: monospace;
      white-space: nowrap;
    }

    td:last-child {
      width: 100%;
    }

    progress {
      width: 40px;
    }
    `]
  }

  constructor () {
    super()
    this.networkStatus = undefined
    this.error = undefined
  }

  async load () {
    this.error = undefined
    try {
      var networkStatus = []
      for (let item of networkStatus) {
        item.drive = await beaker.drives.get(item.key)
        item.peers.sort((a, b) => a.remoteAddress.localeCompare(b.remoteAddress)) // helps spot dupes
      }
      networkStatus.sort((a, b) => b.peers.length - a.peers.length)
      this.networkStatus = networkStatus
      console.log(this.networkStatus)
    } catch (e) {
      console.error(e)
      this.error = e
    }
  }

  unload () {
  }

  // rendering
  // =

  render () {
    return html`
      <link rel="stylesheet" href="beaker://assets/font-awesome.css">
      <h3>Active Drives</h3>
      ${this.error ? html`
        <pre>${this.error.toString()}</pre>
      ` : this.networkStatus ? html `
        ${this.networkStatus.length === 0 ? html`
          <p><em>No active drives</em></p>
        ` : ''}
      ` : html`<p><span class="spinner"></span></p>`}
    `
  }

  // events
  // =

}
customElements.define('network-view', NetworkView)