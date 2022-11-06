import { getAvailableName } from '../../../app-stdlib/js/fs.js'

// exported
// =

export async function load () {
  var bookmarks = []
  try {
    bookmarks = await beaker.bookmarks.list()
    bookmarks = bookmarks.filter(b => b.pinned)
  } catch (e) {
    console.log('Failed to load bookmarks files', e)
  }
  return bookmarks
}

export async function createLink ({href, title}, pinned) {
  let bookmark = await beaker.bookmarks.get(href)
  if (bookmark) title = bookmark.title
  await beaker.bookmarks.add({href, title, pinned})
}

export async function remove (bookmark) {
  await beaker.bookmarks.remove(bookmark.href)
}

// internal
// =

function makeFixedLink (name, href, title) {
  return {
    name,
    stat: {
      isDirectory: () => false,
      isFile: () => true,
      mount: undefined,
      metadata: {href, title}
    },
    isFixed: true
  }
}