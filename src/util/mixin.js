import { mapGetters, mapActions } from 'vuex'
import { addCss, removeAllCss, themeList, getReadTimeByMinute } from './book'
import { getBookmark, saveLocation } from './localStorage'

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    themeList () {
      return themeList(this)
    },
    getSectionName () {
      /* 多级目录不适用
      if (this.section) {
        const sectionInfo = this.currentBook.section(this.section)
        if (sectionInfo && sectionInfo.href && this.currentBook && this.currentBook.navigation) {
          return this.currentBook.navigation.get(sectionInfo.href).label
          // return this.navigation[this.section].label
        }
      } */
      return this.section ? this.navigation[this.section].label : ''
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobalStyle () {
      // 每次全局便添加一个css文件，在很大程度上会导致加载页面的速度，因此在初始化之前先将指定的文件进行删除再添加
      removeAllCss()
      const defaultThemePart = this.defaultTheme.toLowerCase()
      addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_${defaultThemePart}.css`)
    },
    refreshLocation () {
      // currentLocation 给出当前页定位符、开始与结束时的进度百分比，当前准确的页数、当前章节序号
      const currentLocation = this.currentBook.rendition.currentLocation()
      if (currentLocation.start && currentLocation) {
        const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index)
        // 保存初始位置，存入缓存
        const startcfi = currentLocation.start.cfi
        saveLocation(this.fileName, startcfi)
        // 书签
        const bookmark = getBookmark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startcfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
      }
    }, // 刷新位置，确保进度条与章节跳转相符
    display (target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          if (target.startsWith('epubcfi')) {
            this.currentBook.getRange(target).then(range => {
              this.currentBook.rendition.annotations.highlight(target, {}, (e) => {
              })
            })
          }
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    }, // 如果target存在，说明之前看过这本书到一定的章节,初始化渲染，cb回调函数
    hideTitleAndMenu () {
      // this.$store.dispatch('setMenuVisible', false)
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    getReadTimeText () {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    } // 获取时间
  }
}

export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY'
    ]),
    showBookDetail (book) {
      this.$router.push({
        path: '/store/detail',
        query: {
          fileName: book.fileName,
          category: book.categoryText
        }
      })
    }
  }
}
