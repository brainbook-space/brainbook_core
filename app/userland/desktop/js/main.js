import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { EditBookmarkPopup } from '../../app-stdlib/js/com/popups/edit-bookmark.js'
import { AddLinkPopup } from './com/add-link-popup.js'
import * as toast from '../../app-stdlib/js/com/toast.js'
import { writeToClipboard } from '../../app-stdlib/js/clipboard.js'
import { pluralize } from '../../app-stdlib/js/strings.js'
import * as desktop from './lib/desktop.js'
import css from '../css/main.css.js'
import '../../app-stdlib/js/com/img-fallbacks.js'

const VERSION_ID = (major, minor, patch, pre) => major * 1e9 + minor * 1e6 + patch * 1e3 + pre
const CURRENT_VERSION = VERSION_ID(5, 1, 0, 0)
const RELEASE = { label: '5.1.0', url: 'https://brainbook.space/' }

class DesktopApp extends LitElement {
  static get properties () {
    return {
      pins: {type: Array}
    }
  }

  static get styles () {
    return css
  }

  constructor () {
    super()
    this.pins = []
    this.run_develop_mode = undefined
    this.load_settings()
    this.load()
    this.lastDismissedReleaseNotice = localStorage.lastDismissedReleaseNotice
    localStorage.lastDismissedReleaseNotice = CURRENT_VERSION

    window.addEventListener('focus', e => {
      this.load()
    })
    this.addEventListener('update-pins', async (e) => {
      this.pins = await desktop.load()
    })
  }

  async load_settings() {
    let settings = await beaker.browser.getSettings()
    this.run_develop_mode = settings.run_develop_mode
  }

  async load ({clearCurrent} = {clearCurrent: false}) {
    [this.pins] = await Promise.all([
      desktop.load()
    ])
    console.log(this.pins)
  }

  // rendering
  // =

  render () {
      return html`
      <link rel="stylesheet" href="beaker://assets/font-awesome.css">
      <div id="topright">
        <a href="beaker://library/" title="Library">Library</a>
        <a href="beaker://settings/" title="Settings">Settings</a>
      </div>
      ${this.renderSupportBanner()}
      <main>
        <div class="onecol">
          <H2> Browse Using tools in Menu </H2>
          ${this.renderReleaseNotice()}
          ${this.renderPins()}
        </div>
      </main>
    `      
  }

  renderSupportBanner () {
    if (localStorage.hasDismissedSupportBanner) {
      return ''
    }
    return html`
      <div id="support-banner">
        <a title="Support BrainBook" target="_blank">
          <span class="far fa-fw fa-heart"></span>
          Support BrainBook and help us build mentor-mentee software!
        </a>
        <a class="dismiss" href="#" @click=${this.onCloseSupportBanner}><span class="fas fa-times"></span></a>
      </div>
    `
  }

  renderReleaseNotice () {
    if (this.lastDismissedReleaseNotice >= CURRENT_VERSION) {
      return ''
    }
    return html`
      <div class="release-notice">
        <a href=${RELEASE.url} class="view-release-notes" target="_blank">
          <span class="fas fa-fw fa-rocket"></span>
          <strong>Welcome to BrainBook ${RELEASE.label}!</strong>
          Click here to see what's new.
        </a>
      </div>
    `
  }

  renderPins () {
    var pins = this.pins || []
    return html`
      <div class="pins">
        ${repeat(pins, pin => pin.href, pin => html`
          <a
            class="pin"
            href=${pin.href}
            @contextmenu=${e => this.onContextmenuPin(e, pin)}
          >
            <div class="thumb-wrapper">
              <img src=${'asset:screenshot-180:' + pin.href} class="thumb"/>
            </div>
            <div class="details">
              <div class="title">${pin.title}</div>
            </div>
          </a>
        `)}
        <a class="pin add" @click=${e => this.onClickNewBookmark(e, true)}>
          <span class="fas fa-fw fa-plus thumb"></span> Browse Recent History
        </a>
      </div>
    `
  }

  // events
  // =

  onCloseSupportBanner (e) {
    localStorage.hasDismissedSupportBanner = 1
    this.requestUpdate()
  }

  async onClickNewBookmark (e, pinned) {
    try {
      await desktop.createLink(await AddLinkPopup.create(), pinned)
      toast.create('Link added', '', 10e3)
    } catch (e) {
      // ignore, user probably cancelled
      console.log(e)
      return
    }
    this.isEmpty = false
    this.load({clearCurrent: true})
  }

  async onContextmenuPin (e, pin) {
    e.preventDefault()
    const items = [
      {label: 'Open Link in New Tab', click: () => window.open(pin.href)},
      {label: 'Copy Link Address', click: () => writeToClipboard(pin.href)},
      (pin.isFixed) ? undefined : {type: 'separator'},
      (pin.isFixed) ? undefined : {label: 'Edit', click: () => this.onClickEditBookmark(pin)},
      (pin.isFixed) ? undefined : {label: 'Unpin', click: () => this.onClickUnpinBookmark(pin)}
    ].filter(Boolean)
    var fns = {}
    for (let i = 0; i < items.length; i++) {
      if (items[i].id) continue
      let id = `item=${i}`
      items[i].id = id
      fns[id] = items[i].click
      delete items[i].click
    }
    var choice = await beaker.browser.showContextMenu(items)
    if (fns[choice]) fns[choice]()
  }

  async onClickEditBookmark (file) {
    try {
      await EditBookmarkPopup.create(file)
      this.load()
    } catch (e) {
      // ignore
      console.log(e)
    }
  }

  async onClickUnpinBookmark (bookmark) {
    let b = {
      href: bookmark.url,
      title: bookmark.title,
      pinned: false
    }
    await beaker.bookmarks.add(b)
    toast.create('Bookmark unpinned', '', 10e3)
    this.load()
  }
  
}

customElements.define('desktop-app', DesktopApp)
