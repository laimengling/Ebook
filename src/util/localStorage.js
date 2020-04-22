import Storage from 'web-storage-cache'

const localStorage = new Storage()

export function getLocalStorage (key) {
  return localStorage.get(key)
}

export function setLocalStorage (key, value, expire = 30 * 24 * 3600) {
  return localStorage.set(key, value, { exp: expire })
}

export function removeLocalStorage (key) {
  return localStorage.delete(key)
}

export function clearLocalStorage () {
  return localStorage.clear()
}

// 书籍常见的设置与获取属性
export function getHome () {
  return getLocalStorage('home')
}

export function saveHome (home) {
  return setLocalStorage('home', home, 1800)
}

// 设置与获取语言，实现i18n的国际化
export function getLocale () {
  return getLocalStorage('locale')
}

export function saveLocale (locale) {
  return setLocalStorage('locale', locale)
}

export function getLocation (fileName) {
  return getBookObject(fileName, 'location')
}

export function saveLocation (fileName, location) {
  setBookObject(fileName, 'location', location)
}

export function getBookmark (fileName) {
  return getBookObject(fileName, 'bookmark')
}

export function saveBookmark (fileName, bookmark) {
  setBookObject(fileName, 'bookmark', bookmark)
}

export function getReadTime (fileName) {
  return getBookObject(fileName, 'time')
}

export function saveReadTime (fileName, theme) {
  setBookObject(fileName, 'time', theme)
}

export function getProgress (fileName) {
  return getBookObject(fileName, 'progress')
}

export function saveProgress (fileName, progress) {
  setBookObject(fileName, 'progress', progress)
}

export function getNavigation (fileName) {
  return getBookObject(fileName, 'navigation')
}

export function saveNavigation (fileName, navigation) {
  setBookObject(fileName, 'navigation', navigation)
}

export function getMetadata (fileName) {
  return getBookObject(fileName, 'metadata')
}

export function saveMetadata (fileName, metadata) {
  setBookObject(fileName, 'metadata', metadata)
}

export function getCover (fileName) {
  return getBookObject(fileName, 'cover')
}

export function saveCover (fileName, cover) {
  setBookObject(fileName, 'cover', cover)
}

// 字体类型
export function getFontFamily (fileName) {
  return getBookObject(fileName, 'fontFamily')
}

export function saveFontFamily (fileName, fontFamily) {
  setBookObject(fileName, 'fontFamily', fontFamily)
}

export function getTheme (fileName) {
  return getBookObject(fileName, 'theme')
}

export function saveTheme (fileName, theme) {
  setBookObject(fileName, 'theme', theme)
}

// 字体大小
export function getFontSize (fileName) {
  return getBookObject(fileName, 'fontSize')
}

export function saveFontSize (fileName, fontSize) {
  setBookObject(fileName, 'fontSize', fontSize)
}

// 书籍对应属性的获取与设置
export function getBookObject (fileName, key) {
  if (getLocalStorage(`${fileName}-info`)) {
    return getLocalStorage(`${fileName}-info`)[key]
  } else {
    return null
  }
}

export function setBookObject (fileName, key, value) {
  let book = {}
  if (getLocalStorage(`${fileName}-info`)) {
    book = getLocalStorage(`${fileName}-info`)
  }
  book[key] = value
  setLocalStorage(`${fileName}-info`, book)
}
