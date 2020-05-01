<template>
    <div class="ebook-bookmark" ref="bookmark">
        <div class="ebook-bookmark-text-wrapper">
            <div class="ebook-bookmark-down-wrapper" ref="iconDown">
                <span class="icon-down"></span>
            </div>
            <div class="ebook-bookmark-text">{{text}}</div>
        </div>
        <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
            <bookmark :color="color" :width="15" :height="35"></bookmark>
        </div>
    </div>
</template>

<script>
import Bookmark from '../common/Bookmark'
import { realPx } from '../../util/utils'
import { ebookMixin } from '../../util/mixin'
import { getBookmark, saveBookmark } from '../../util/localStorage'

const BLUE = '#346cbc'
const WHITE = '#fff'
export default {
  components: {
    Bookmark
  },
  mixins: [ebookMixin],
  data () {
    return {
      text: this.$t('book.pulldownAddMark'),
      color: WHITE,
      isFixed: false
    }
  },
  computed: {
    height () {
      return realPx(35)
    },
    threshold () {
      return realPx(55)
    },
    fixedStyle () {
      return {
        position: 'fixed',
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}`,
        top: 0
      }
    }
  },
  watch: {
    offsetY (v) { // 书签位置的移动需要根据offsetY 第二阶段35<offsetY<=55吸附在顶部 第三阶段添加书签，书签定格在页面上
      if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
        return
      }
      if (v >= this.height && v <= this.threshold) {
        this.beforeThreshold(v)
      } else if (v >= this.threshold) {
        this.afterThreshold(v)
      } else if (v > 0 && v < this.height) {
        this.beforeHight() // 初始化状态
      } else if (v === 0) {
        this.restore()
      }
    },
    isBookmark (isBookmark) {
      if (isBookmark) {
        this.color = BLUE
        this.isFixed = true
      } else {
        this.color = WHITE
        this.isFixed = false
      }
    }
  },
  methods: {
    addBookmark () {
      this.bookmark = getBookmark(this.fileName)
      if (!this.bookmark) {
        this.bookmark = []
      }
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfibase = currentLocation.start.cfi.replace(/!.*/, '').replace('epubcfi(', '')
      const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)/, '')
      const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)/, '')
      const cfiRange = `epubcfi(${cfibase}!,${cfistart},${cfiend})`
      this.currentBook.getRange(cfiRange).then(range => { // 获取cfi范围，根据这个范围得出文本，用于后期显示
        const text = range.toString().replace(/\s\s/g, '') // 获取文本的空格删除
        this.bookmark.push({
          cfi: currentLocation.start.cfi,
          text: text
        })
        saveBookmark(this.fileName, this.bookmark)
      })
    },
    moveBookmark () {
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfi = currentLocation.start.cfi
      this.bookmark = getBookmark(this.fileName)
      if (this.bookmark) {
        this.bookmark = this.bookmark.filter(item => item.cfi !== cfi)
        saveBookmark(this.fileName, this.bookmark)
        this.setIsBookmark(false)
      }
    },
    restore () {
      setTimeout(() => {
        this.$refs.bookmark.style.top = `${-this.height}px`
        this.$refs.iconDown.style.transform = 'rotate(0deg)'
      }, 200)
      if (this.isFixed) {
        this.setIsBookmark(true)
        this.addBookmark()
      } else {
        this.setIsBookmark(false)
        this.moveBookmark(true)
      }
    }, // 第四阶段：归位
    beforeHight () {
      if (this.isBookmark) {
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = BLUE
        this.isFixed = true
      } else {
        this.text = this.$t('book.pulldownAddMark')
        this.color = WHITE
        this.isFixed = false
      }
      this.isFixed = false
    }, // 第一阶段未超过书签的高度
    beforeThreshold (v) {
      const iconDown = this.$refs.iconDown
      this.$refs.bookmark.style.top = `${-v}px`
      this.beforeHight()
      if (iconDown.style.transform === 'rotate(180deg)') {
        iconDown.style.transform = 'rotate(0deg)'
      }
      this.isFixed = false
    }, // 第二阶段下拉不足55px时，符号旋转，书页吸顶
    afterThreshold (v) {
      const iconDown = this.$refs.iconDown
      this.$refs.bookmark.style.top = `${-v}px`
      if (this.isBookmark) {
        this.text = this.$t('book.releaseDeleteMark')
        this.color = WHITE
        this.isFixed = false
      } else {
        this.text = this.$t('book.releaseAddMark')
        this.color = BLUE
        this.isFixed = true
      }
      if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
        iconDown.style.transform = 'rotate(180deg)'
      }
    } // 第三阶段 大于55px时标题改变，图标旋转
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "../../assets/styles/global";
    .ebook-bookmark {
        position: absolute;
        top: px2rem(-35);
        left: 0;
        z-index: 200;
        width: 100%;
        height: px2rem(35);
        background: #909090;
        .ebook-bookmark-text-wrapper{
            position: absolute;
            right: px2rem(45);
            bottom: 0;
            display: flex;
            .ebook-bookmark-down-wrapper{
                font-size: px2rem(14);
                color: white;
                transition: all 0.2s linear;
                @include center;
            }
            .ebook-bookmark-text{
                font-size: px2rem(14);
                color: white;
            }
        }
        .ebook-bookmark-icon-wrapper{
            position: absolute;
            right: 0;
            bottom: 0;
            margin-right: px2rem(15);
        }
    }
</style>
