<template>
    <div class="ebook" ref="ebook">
        <ebook-header></ebook-header>
        <ebook-title></ebook-title>
        <ebook-reader></ebook-reader>
        <ebook-menu></ebook-menu>
        <ebook-bookmark></ebook-bookmark>
        <ebook-footer></ebook-footer>
    </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader'
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'
import EbookBookmark from '../../components/ebook/EbookBookmark'
import EbookHeader from '../../components/ebook/EbookHeader'
import EbookFooter from '../../components/ebook/EbookFooter'
import {
  getReadTime,
  saveReadTime
} from '../../util/localStorage'
import { ebookMixin } from '../../util/mixin'

export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  watch: {
    offsetY (v) {
      if (!this.menuVisible && this.bookAvailable) { // 菜单栏出现不可添加标签
        if (v > 0) {
          this.move(v) // 整个页面下拉
        } else if (v === 0) {
          this.restore()
        }
      }
    } // watch监听offsetY，v为新值
  },
  methods: {
    restore () {
      this.$refs.ebook.style.top = '0px'
      this.$refs.ebook.style.transition = 'all .2s linear'
      setTimeout(() => {
        this.$refs.ebook.style.transition = ''
      }, 200)
      // 每次restore的时候，都会触发一个transition，因此会不流畅，解决：在固定时间后删除transition
    },
    move (v) {
      this.$refs.ebook.style.top = v + 'px'
    },
    startLoopReadTime () {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    } // 开启定时任务，每半分钟写入缓存
  },
  mounted () { //
    this.startLoopReadTime()
  },
  beforeDestroy () {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "../../assets/styles/global";
    .ebook{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000!important;
    }
</style>
