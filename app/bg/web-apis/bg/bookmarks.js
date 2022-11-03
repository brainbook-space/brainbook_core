import * as bookmarksDb from '../../dbs/bookmarks'

// exported api
// =

export default {
  async add (...args) {
    return bookmarksDb.add(...args)
  },
  
  async remove (...args) {
    return bookmarksDb.remove(...args)
  },

  async get (...args) {
    return bookmarksDb.get(...args)
  },

  async list (...args) {
    return bookmarksDb.list(...args)
  }
}
