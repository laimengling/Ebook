import { mapGetters, mapActions } from 'vuex'
import { addCss, removeAllCss, themeList } from './book'

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
    }
  }
}
