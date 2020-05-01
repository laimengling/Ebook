const book = {
  state: {
    fileName: '',
    menuVisible: false, // menu是否显示
    settingVisible: -1, // -1:不显示，0：字号，1：主题，2：进度条，3：目录
    defaultFontSize: 16, // 默认字体大小
    defaultFontFamily: 'Default', // 默认字体类型
    fontFamilyVisible: false, // 默认字体板块是否可见
    defaultTheme: 'Default', // 默认主题
    bookAvailable: false, // 书籍是否加载完成
    progress: 0, // 阅读书籍进度条
    section: 0, // 阅读书籍章节
    isPaginating: true,
    currentBook: null, // 当前书籍
    navigation: null, // 目录对象
    cover: null, // 书籍封面
    metadata: null, // 书籍的基本信息
    paginate: '',
    pagelist: null,
    offsetY: 0, // 书签y轴偏移量
    isBookmark: null
  },
  mutations: {
    SET_FILENAME: (state, fileName) => {
      state.fileName = fileName
    },
    SET_MENUVISIBLE: (state, visible) => {
      state.menuVisible = visible
    },
    SET_SETTINGVISIBLE: (state, visible) => {
      state.settingVisible = visible
    },
    SET_DEFAULTFONTSIZE: (state, fontSize) => {
      state.defaultFontSize = fontSize
    },
    SET_DEFAULTFONTFAMILY: (state, font) => {
      state.defaultFontFamily = font
    },
    SET_FONTFAMILYVISIBLE: (state, visible) => {
      state.fontFamilyVisible = visible
    },
    SET_DEFAULTTHEME: (state, theme) => {
      state.defaultTheme = theme
    },
    SET_BOOKAVAILABLE: (state, bookAvailable) => {
      state.bookAvailable = bookAvailable
    },
    SET_PROGRESS: (state, progress) => {
      state.progress = progress
    },
    SET_SECTION: (state, section) => {
      state.section = section
    },
    SET_ISPAGINATING: (state, isPaginating) => {
      state.isPaginating = isPaginating
    },
    SET_CURRENTBOOK: (state, currentBook) => {
      state.currentBook = currentBook
    },
    SET_NAVIGATION: (state, navigation) => {
      state.navigation = navigation
    },
    SET_COVER: (state, cover) => {
      state.cover = cover
    },
    SET_METADATA: (state, metadata) => {
      state.metadata = metadata
    },
    SET_PAGINATE: (state, paginate) => {
      state.paginate = paginate
    },
    SET_PAGELIST: (state, pagelist) => {
      state.pagelist = pagelist
    },
    SET_OFFSETY: (state, offsetY) => {
      state.offsetY = offsetY
    },
    SET_ISBOOKMARK: (state, isBookmark) => {
      state.isBookmark = isBookmark
    }
  }
}

export default book
