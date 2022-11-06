import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { writeToClipboard } from '../../../app-stdlib/js/clipboard.js'
import { emit } from '../../../app-stdlib/js/dom.js'
import * as toast from '../../../app-stdlib/js/com/toast.js'
import { EditBookmarkPopup } from '../../../app-stdlib/js/com/popups/edit-bookmark.js'
import bookmarksCSS from '../../css/views/bookmarks.css.js'

export class BookmarksView extends LitElement {
  static get properties () {
    return {
      bookmarks: {type: Array},
      filter: {type: String},
      showHeader: {type: Boolean, attribute: 'show-header'},
      hideEmpty: {type: Boolean, attribute: 'hide-empty'}
    }
  }

  static get styles () {
    return bookmarksCSS
  }

  constructor () {
    super()
    this.bookmarks = undefined
    this.filter = undefined
    this.showHeader = false
    this.hideEmpty = false
    this.load()
  }

  async load () {
    var bookmarks = await beaker.bookmarks.list()
    bookmarks.sort((a, b) => a.title.localeCompare(b.title))
    this.bookmarks = bookmarks
    console.log(this.bookmarks)
  }

  async bookmarkMenu (bookmark) {
    var items = [
      {label: 'Open Link in New Tab', click: () => window.open(bookmark.url)},
      {label: 'Copy Link Address', click: () => writeToClipboard(bookmark.url)},
      {type: 'separator'},
      {label: 'Edit', click: () => this.onClickEdit(bookmark)},
      {type: 'checkbox', checked: bookmark.pinned, label: 'Pin to start page', click: () => this.onToggleBookmarkPinned(null, bookmark)},
      {type: 'separator'},
      {label: 'Delete', click: () => this.onClickRemove(bookmark)}
    ]
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

  // rendering
  // =

  render () {
    var bookmarks = this.bookmarks
    if (bookmarks && this.filter) {
      bookmarks = bookmarks.filter(bookmark => (
        bookmark.href.toLowerCase().includes(this.filter)
        || bookmark.title.toLowerCase().includes(this.filter)
      ))
    }
    return html`
      <link rel="stylesheet" href="beaker://app-stdlib/css/fontawesome.css">
      ${bookmarks ? html`
        ${this.showHeader && !(this.hideEmpty && bookmarks.length === 0) ? html`
          <h4>Bookmarks</h4>
        ` : ''}
        <div class="bookmarks">
          ${repeat(bookmarks, bookmark => this.renderBookmark(bookmark))}
          ${bookmarks.length === 0 && this.filter ? html`
            <div class="empty"><div>No matches found for "${this.filter}".</div></div>
          ` : ''}
        </div>
      ` : html`
        <div class="loading"><span class="spinner"></span></div>
      `}
    `
  }

  renderBookmark (bookmark) {
    var {href, title} = bookmark
    return html`
      <a
        class="bookmark"
        href=${href}
        title=${title || ''}
        @contextmenu=${e => this.onContextmenuBookmark(e, bookmark)}
      >
        <img class="favicon" src="asset:favicon:${href}">
        <div class="title">${title}</div>
        <div class="href">${href}</div>
        <div class="ctrls">
          <button class="transparent" @click=${e => this.onClickBookmarkMenuBtn(e, bookmark)}><span class="fas fa-fw fa-ellipsis-h"></span></button>
        </div>
      </div>
    `
  }

  // events
  // =

  async onContextmenuBookmark (e, bookmark) {
    e.preventDefault()
    e.stopPropagation()
    await this.bookmarkMenu(bookmark)
  }

  onClickBookmarkMenuBtn (e, bookmark) {
    e.preventDefault()
    e.stopPropagation()
    this.bookmarkMenu(bookmark)
  }

  async onToggleBookmarkPinned (e, bookmark) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (bookmark.pinned) {
      let b = {
        href: bookmark.url,
        title: bookmark.title,
        pinned: false
      }
      await beaker.bookmarks.add(b)
    } else {
      let b = {
        href: bookmark.url,
        title: bookmark.title,
        pinned: true
      }
      await beaker.bookmarks.add(b)
    }
    this.load()
    emit(this, 'update-pins')
  }

  async onClickEdit (bookmark) {
    try {
      await EditBookmarkPopup.create(bookmark)
      this.load()
    } catch (e) {
      // ignore
      console.log(e)
    }
  }

  async onClickRemove (bookmark) {
    if (!confirm('Are you sure?')) return
    await beaker.bookmarks.remove(bookmark.url)
    toast.create('Bookmark removed', '', 10e3)
    this.load()
  }
}

customElements.define('bookmarks-view', BookmarksView)