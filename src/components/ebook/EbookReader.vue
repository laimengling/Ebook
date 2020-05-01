<template>
    <div class="ebook-reader">
        <div id="read"></div>
        <div class="mask"
             @click="onMaskClick"
             @touchmove = "move"
             @touchend = "moveEnd"
             @mousedown.left="onMouseEnter"
             @mousemove.left="onMouseMove"
             @mouseup.left="onMouseEnd"
        >
            <!--
                手机端和PC端手势不兼容
                鼠标与手势的区别在于鼠标移动就会触发mousemove，而手势需要手指按下移动触发touchmove
            -->
        </div>
    </div>
</template>

<script>
import { ebookMixin } from '../../util/mixin'
import Epub from 'epubjs'
import {
  getFontFamily,
  getFontSize,
  getLocation,
  getTheme,
  saveFontFamily,
  saveFontSize,
  saveTheme
} from '../../util/localStorage'
import { flatten } from '../../util/book'

global.ePub = Epub
export default {
  mixins: [ebookMixin],
  methods: {
    // 1 - 鼠标进入
    // 2 - 鼠标进入后的移动
    // 3 - 鼠标从移动状态松手
    // 4 - 鼠标还原
    onMouseEnter (e) {
      this.mouseState = 1
      this.mouseStartTime = e.timeStamp
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseMove (e) {
      if (this.mouseState === 1) {
        this.mouseState = 2
      } else if (this.mouseState === 2) {
        // 防止鼠标在未按下的时候，移动触发操作
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY // 界面偏移量等于最新的触控点 - 初始的触控点
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.clientY // 第一个点击的触控点
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnd (e) {
      if (this.mouseState === 2) {
        this.setOffsetY(0)
        this.firstOffsetY = null
        this.mouseState = 3
      } else {
        this.mouseState = 4
      }
      const time = e.timeStamp - this.mouseStartTime
      if (time < 100) {
        // 当点击事件很短的时候，或者移动类点击的时候，就可以触发点击事件 onmouseClick
        this.mouseState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    prevPage () {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    }, // 上一页
    nextPage () {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    }, // 下一页
    toggleTitleAndMenu () {
      // this.$store.dispatch('setMenuVisible', !this.menuVisible)
      if (this.menuVisible) { // 当前的状态为true，需要toggle为false，设置面板需要隐藏
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    initFontSize () {
      // 字体大小缓存与展示
      const fontSize = getFontSize(this.fileName)
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.rendition.themes.font(fontSize)
        this.setDefaultFontSize(fontSize)
      }
    },
    initFontFamily () {
      // book渲染后，将默认设置存入缓存,如果缓存中存在设置，就渲染出来,同时该书在vuex的保存的状态也需同步更新
      const font = getFontFamily(this.fileName)
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily)
      } else {
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },
    initTheme () {
      // 注册主题类型
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      this.themeList.forEach(theme => {
        this.themes.register(theme.name, theme.style)
      })
      this.themes.select(defaultTheme)
    },
    initRendition () {
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default'
      })
      // 判定是否已读，已读跳转章节，并刷新使得进度条等一致
      const location = getLocation(this.fileName)
      this.display(location, () => {
        this.initFontSize()
        this.initFontFamily()
        this.initTheme()
        this.initGlobalStyle()
      })
      // 加载css文件
      this.rendition.hooks.content.register(contents => {
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`)
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/Cabin.css`)
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/Montserrat.css`)
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/Tangerine.css`)
        // addStylesheet 参数必须是路径，为了在开发后，环境变量统一加载到用户中，添加.env.development
        // 使用过程中注意需要重新关闭服务器
      })
    }, // 初始化渲染的过程函数
    initEpub () {
      const url = `${process.env.VUE_APP_RES_URL}/epub/` + this.fileName + '.epub'
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      this.parseBook()
      // 获取themes对象，便于改变主题颜色
      this.themes = this.rendition.themes
      // location直接生成内存消耗大，使用book的钩子函数
      this.book.ready.then(() => {
        // 标准宽度为375像素 字体大小为16像素 预计分为750页，根据实际情况进行分页
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
      }).then(locations => {
        this.setBookAvailable(true)
        this.refreshLocation()
      })
      /* 本段代码废弃，原因：在浏览器当中不知为何，H5的touchstart与touchend不被触发
      this.rendition.on('touchstart', event => {
        this.touchStartX = event.changedTouches[0].clientX
        this.touchStartTime = event.timeStamp
      })
      this.rendition.on('touchend', event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX
        const time = event.timeStamp - this.touchStartTime
        if (time < 500 && offsetX > 40) {
          this.prevPage()
        } else if (time < 500 && offsetX < -40) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
        event.preventDefault()
        event.stopPropagation() // 禁止传播
      }) */
    }, // 电子书的解析和渲染
    parseBook () {
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url) // 返回blob 资源类型
        })
      })
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
      })
      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc)
        function find (item, level = 0) {
          return !item.parent ? level : find(
            navItem.filter(parentItem => parentItem.id === item.parent)[0],
            ++level)
        }
        navItem.forEach(item => {
          item.level = find(item)
        })
        this.setNavigation(navItem)
      })
    }, // 解析电子书的基本信息，方便目录中查找下方信息的修改
    onMaskClick (e) {
      if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
        return
      }
      // 默认当鼠标点击但是什么都没有干，这时出现menu和title是可以的，其他被鼠标事件拦截
      const offsetX = e.offsetX
      const width = window.innerWidth
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage()
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage()
      } else {
        this.toggleTitleAndMenu()
      }
    }, // 翻页
    move (e) {
      let offsetY = 0
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY // 界面偏移量等于最新的触控点 - 初始的触控点
        this.setOffsetY(offsetY)
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY // 第一个点击的触控点
      }
      e.preventDefault()
      e.stopPropagation()
    },
    moveEnd (e) {
      this.setOffsetY(0)
      this.firstOffsetY = null
    } // 书签页的手势
  },
  mounted () {
    const fileName = this.$route.params.fileName.split('|').join('/')
    /* this.$store.dispatch('setFileName', fileName).then(() => {
      this.initEpub()
    }) */
    // 使用vuex时，未进行映射，则使用方法dispatch
    // actions.js保存公共的方法，在index.js导入注册，minxin.js是多个文件使用时，可以直接使用this调用
    this.setFileName(fileName).then(() => {
      this.initEpub()
    })
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "../../assets/styles/global";
    .ebook-reader{
        position: relative;
        .mask{
            position: absolute;
            top:0;
            left:0;
            width: 100%;
            height: 100%;
            background: transparent;
            z-index: 100;
            display: flex;
        }
    }
</style>
