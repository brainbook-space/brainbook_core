import * as rpc from 'pauls-electron-rpc'
import { findTab } from '../ui/tabs/manager'

const INTERNAL_ORIGIN_REGEX = /^(beaker:)/i
const SITE_ORIGIN_REGEX = /^(beaker:|hyper:|https?:|data:)/i
const IFRAME_WHITELIST = [
  'hyperdrive.loadDrive',
  'hyperdrive.getInfo',
  'hyperdrive.diff',
  'hyperdrive.stat',
  'hyperdrive.readFile',
  'hyperdrive.readdir',
  'hyperdrive.query',
  'hyperdrive.watch',
  'hyperdrive.resolveName'
]

// internal manifests
import loggerManifest from './manifests/internal/logger'
import beakerBrowserManifest from './manifests/internal/browser'
import bookmarksManifest from './manifests/internal/bookmarks'
import downloadsManifest from './manifests/internal/downloads'
import historyManifest from './manifests/internal/history'
import sitedataManifest from './manifests/internal/sitedata'

// internal apis
import { WEBAPI as loggerAPI } from '../logger'
import { WEBAPI as auditLogAPI } from '../dbs/audit-log'
import bookmarksAPI from './bg/bookmarks'
import historyAPI from './bg/history'
import { WEBAPI as sitedataAPI } from '../dbs/sitedata'
import { WEBAPI as downloadsAPI } from '../ui/downloads'
import { WEBAPI as beakerBrowserAPI } from '../browser'

// external manifests
import markdownManifest from './manifests/external/markdown'
import panesManifest from './manifests/external/panes'
import shellManifest from './manifests/external/shell'

// external apis
import markdownAPI from './bg/markdown'
import panesAPI from './bg/panes'

// experimental manifests
import experimentalCapturePageManifest from './manifests/external/experimental/capture-page'
import experimentalGlobalFetchManifest from './manifests/external/experimental/global-fetch'

// experimental apis
import experimentalCapturePageAPI from './bg/experimental/capture-page'
import experimentalGlobalFetchAPI from './bg/experimental/global-fetch'

// exported api
// =

export const setup = function () {
  // internal apis
  rpc.exportAPI('logger', loggerManifest, Object.assign({}, auditLogAPI, loggerAPI), internalOnly)
  rpc.exportAPI('beaker-browser', beakerBrowserManifest, beakerBrowserAPI, internalOnly)
  rpc.exportAPI('bookmarks', bookmarksManifest, bookmarksAPI, internalOnly)
  rpc.exportAPI('downloads', downloadsManifest, downloadsAPI, internalOnly)
  rpc.exportAPI('history', historyManifest, historyAPI, internalOnly)
  rpc.exportAPI('sitedata', sitedataManifest, sitedataAPI, internalOnly)

  // external apis
  rpc.exportAPI('markdown', markdownManifest, markdownAPI)
  rpc.exportAPI('panes', panesManifest, panesAPI, secureOnly('panes'))

  // experimental apis
  rpc.exportAPI('experimental-capture-page', experimentalCapturePageManifest, experimentalCapturePageAPI, secureOnly)
  rpc.exportAPI('experimental-global-fetch', experimentalGlobalFetchManifest, experimentalGlobalFetchAPI, secureOnly)
}

function internalOnly (event, methodName, args) {
  if (!(event && event.sender)) {
    return false
  }
  var senderInfo = getSenderInfo(event)
  return senderInfo.isMainFrame && INTERNAL_ORIGIN_REGEX.test(senderInfo.url)
}

const secureOnly = apiName => (event, methodName, args) => {
  if (!(event && event.sender)) {
    return false
  }
  var senderInfo = getSenderInfo(event)
  if (!SITE_ORIGIN_REGEX.test(senderInfo.url)) {
    return false
  }
  if (!senderInfo.isMainFrame) {
    return IFRAME_WHITELIST.includes(`${apiName}.${methodName}`)
  }
  return true
}

function getSenderInfo (event) {
  var tab = findTab(event.sender)
  if (tab) return tab.getIPCSenderInfo(event)
  return {isMainFrame: true, url: event.sender.getURL()}
}