// import { joinPath } from '../../lib/strings.js'
import { normalizeUrl } from '../../lib/urls'
// import * as drives from '../hyper/drives'
// import { query } from './query'
// import * as filesystem from './index'
// import * as pinsAPI from './pins'
// import { URL } from 'url'
import * as profileDb from '../dbs/profile-data-db'

// exported
// =

/**
 * @returns {Promise<Object>}
 */
export async function list () {
  // var privateDrive = filesystem.get()

  // var bookmarks =  await query(privateDrive, {path: '/bookmarks/*.goto'})
  // var pins = await pinsAPI.getCurrent()
  // return bookmarks.map(r => massageBookmark(r, pins))
  return profileDb.all(`SELECT url, title, pinned FROM bookmarks ORDER BY createdAt DESC`)
}

/**
 * @param {string} href
 * @returns {Promise<Object>}
 */
export async function get (href) {
  // href = normalizeUrl(href)
  // var bookmarks = await list()
  // return bookmarks.find(b => b.href === href)
  return profileDb.get(`SELECT url, title FROM bookmarks WHERE url = ?`, [ href])
}

/**
 * @param {Object} bookmark
 * @param {string} bookmark.href
 * @param {string} bookmark.title
 * @param {Boolean} bookmark.pinned
 * @returns {Promise<string>}
 */
export async function add ({href, title, pinned}) {
  // href = normalizeUrl(href)
  // var drive = filesystem.get()

  // let existing = await get(href)
  // if (existing) {
  //   if (typeof title === 'undefined') title = existing.title
  //   if (typeof pinned === 'undefined') pinned = existing.pinned

  //   let urlp = new URL(existing.bookmarkUrl)
  //   await drive.pda.updateMetadata(urlp.pathname, {href, title})
  //   if (pinned !== existing.pinned) {
  //     if (pinned) await pinsAPI.add(href)
  //     else await pinsAPI.remove(href)
  //   }
  //   return
  // }

  // // new bookmark
  // var slug = createResourceSlug(href, title)
  // var filename = await filesystem.getAvailableName('/bookmarks', slug, 'goto', drive) // avoid collisions
  // var path = joinPath('/bookmarks', filename)
  // await filesystem.ensureDir('/bookmarks', drive)
  // await drive.pda.writeFile(path, '', {metadata: {href, title}})
  // if (pinned) await pinsAPI.add(href)
  // return path
  return profileDb.run(`
    INSERT OR REPLACE
      INTO bookmarks (profileId, url, title, pinned)
      VALUES (?, ?, ?, ?)
  `, [0, href, title, pinned])
}

/**
 * @param {string} href
 * @returns {Promise<void>}
 */
export async function remove (href) {
  // let existing = await get(href)
  // if (!existing) return
  // let urlp = new URL(existing.bookmarkUrl)
  // let drive = await drives.getOrLoadDrive(urlp.hostname)
  // await drive.pda.unlink(urlp.pathname)
  // if (existing.pinned) await pinsAPI.remove(existing.href)
  return profileDb.run(`DELETE FROM bookmarks WHERE profileId = ? AND url = ?`, [0, href])

}

export async function migrateBookmarksFromSqlite () {
  // var bookmarks = await profileprofileDb.all(`SELECT * FROM bookmarks`)
  // for (let bookmark of bookmarks) {
  //   await add({
  //     href: bookmark.url,
  //     title: bookmark.title,
  //     pinned: false, // pinned: bookmark.pinned - DONT migrate this because 0.8 pinned bookmarks are often dat://
  //   })
  // }
}

// internal
// =

function massageBookmark (result, pins) {
  let href = normalizeUrl(result.stat.metadata.href) || ''
  return {
    bookmarkUrl: result.url,
    href,
    title: result.stat.metadata.title || href || '',
    pinned: pins.includes(href)
  }
}