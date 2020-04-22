<template>
    <div class="ebook-reader">
        <div id="read"></div>
        <div class="mask">
            <div class="left" @click="prevPage()"></div>
            <div class="center" @click="toggleTitleAndMenu()"></div>
            <div class="right" @click="nextPage()"></div>
        </div>
    </div>
</template>

<script>
import { ebookMixin } from '../../util/mixin'
import Epub from 'epubjs'
global.ePub = Epub
export default {
  mixins: [ebookMixin],
  methods: {
    prevPage () { // 上一页
      if (this.rendition) {
        this.rendition.prev()
        this.hideTitleAndMenu()
      }
    },
    nextPage () { // 下一页
      if (this.rendition) {
        this.rendition.next()
        this.hideTitleAndMenu()
      }
    },
    toggleTitleAndMenu () {
      // this.$store.dispatch('setMenuVisible', !this.menuVisible)
      if (this.menuVisible) { // 当前的状态为true，需要toggle为false，设置面板需要隐藏
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    hideTitleAndMenu () {
      // this.$store.dispatch('setMenuVisible', false)
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    initEpub () { // 电子书的解析和渲染
      const url = 'http://localhost:9091/epub/' + this.fileName + '.epub'
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default'
      })
      this.rendition.display()
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
      this.rendition.hooks.content.register(contents => {
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`)
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/Cabin.css`)
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/Montserrat.css`)
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/Tangerine.css`)
        // addStylesheet 参数必须是路径，为了在开发后，环境变量统一加载到用户中，添加.env.development
        // 使用过程中注意需要重新关闭服务器
      })
    }
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
            z-index: 100;
            display: flex;
            .left{
                flex: 0 0 px2rem(100);
            }
            .center{
                flex: 1;
            }
            .right{
                flex: 0 0 px2rem(100);
            }
        }
    }
</style>
