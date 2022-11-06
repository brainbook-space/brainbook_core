const isNode = typeof window === 'undefined'
const parse = isNode ? require('url').parse : browserParse

const isIPAddressRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
const isPath = /^\//
const URL_RE = /^[\S]+:\/\/[\S]+$/i

// helper to determine what the user may be inputting into the locaiton bar
export function examineLocationInput (v) {
  // does the value look like a url?
  var isProbablyUrl = (!v.includes(' ') && (
    isPath.test(v) ||
    /\.[A-z]/.test(v) ||
    isIPAddressRegex.test(v) ||
    v.startsWith('localhost') ||
    v.includes('://') ||
    v.startsWith('beaker:') ||
    v.startsWith('data:') ||
    v.startsWith('intent:') ||
    v.startsWith('about:')
  ))
  var vWithProtocol = v
  var isGuessingTheScheme = false
  if (isProbablyUrl && !isPath.test(v) && !v.includes('://') && !(v.startsWith('beaker:') || v.startsWith('data:') || v.startsWith('intent:') || v.startsWith('about:'))) {
    if (v.startsWith('localhost') || isIPAddressRegex.test(v)) {
      vWithProtocol = 'http://' + v
    } else {
      vWithProtocol = 'https://' + v
      isGuessingTheScheme = true // note that we're guessing so that, if this fails, we can try http://
    }
  }
  var vSearch = '?q=' + v.split(' ').map(encodeURIComponent).join('+')
  return {vWithProtocol, vSearch, isProbablyUrl, isGuessingTheScheme}
}

const SCHEME_REGEX = /[a-z]+:\/\//i
//                   1          2      3        4
const VERSION_REGEX = /^(hyper:\/\/)?([^/]+)(\+[^/]+)(.*)$/i
export function parseDriveUrl (str, parseQS) {
  var parsed, version = null, match = VERSION_REGEX.exec(str)
  if (match) {
    // run typical parse with version segment removed
    parsed = parse((match[1] || '') + (match[2] || '') + (match[4] || ''), parseQS)
    version = match[3].slice(1)
  } else {
    parsed = parse(str, parseQS)
  }
  if (isNode) parsed.href = str // overwrite href to include actual original
  else parsed.path = parsed.pathname // to match node
  if (!parsed.query && parsed.searchParams) {
    parsed.query = Object.fromEntries(parsed.searchParams) // to match node
  }
  parsed.version = version // add version segment
  return parsed
}

function browserParse (str) {
  return new URL(str)
}

/**
 * @param {String} str 
 * @returns {String}
 */
export function normalizeOrigin (str) {
  try {
    let {protocol, hostname, port} = new URL(str)
    return `${protocol}//${hostname}${(port ? `:${port}` : '')}`
  } catch {
    // assume hyper, if this fails then bomb out
    let {protocol, hostname, port} = new URL(`hyper://${str}`)
    return `${protocol}//${hostname}${(port ? `:${port}` : '')}`
  }
}

/**
 * @param {String} a 
 * @param {String} b 
 * @returns {Boolean}
 */
export function isSameOrigin (a, b) {
	return normalizeOrigin(a) === normalizeOrigin(b)
}

/**
 * @param {String} url
 * @param {String} [base]
 * @returns {String}
 */
export function normalizeUrl (url, base = undefined) {
  try {
    let {protocol, hostname, port, pathname, search, hash} = new URL(url, base)
    return `${protocol}//${hostname}${(port ? `:${port}` : '')}${pathname || '/'}${search}${hash}`
  } catch {
    return url
  }
}

/**
 * @param {String} url 
 * @returns {Boolean}
 */
export function isUrlLike (url) {
  return typeof url === 'string' && URL_RE.test(url)
}

/**
 * @param {String} url 
 * @returns {String}
 */
export function stripUrlHash (url) {
  try {
    let i = url.indexOf('#')
    if (i !== -1) return url.slice(0, i)
    return url
  } catch (e) {
    return url
  }
}