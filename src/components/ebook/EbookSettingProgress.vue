<template>
    <transition name="slide-up">
        <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
            <div class="setting-progress" >
                <div class="read-time-wrapper">
                    <span class="read-time-text">{{getReadTimeText()}}</span>
                    <span class="icon-forward"></span>
                </div>
                <div class="progress-wrapper" >
                    <div class="progress-icon-wrapper" @click="prevSection()">
                        <span class="icon-back" ></span>
                    </div>
                    <input type="range"
                           class="progress"
                           max="100"
                           min="0"
                           step="1"
                           :value="progress"
                           :disabled="!bookAvailable"
                           @change="onProgressChange($event.target.value)"
                           @input="onProgressInput($event.target.value)"
                           ref="progress"
                    >
                    <!--change是指进度条拖动松手触发的事件 input是指进度条拖动过程中触发的事件-->
                    <div class="progress-icon-wrapper" @click="nextSection()">
                        <span class="icon-forward"></span>
                    </div>
                </div>
                <div class="text-wrapper">
                    <span class="progress-section-text">{{getSectionName}}</span>
                    <span>（{{bookAvailable ? progress + '%' : '加载中……'}}）</span>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { ebookMixin } from '../../util/mixin'
import {
  saveProgress
} from '../../util/localStorage'

export default {
  mixins: [ebookMixin],
  computed: {
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
    onProgressChange (progress) {
      // progress 进度条的数值（0-100）
      this.setProgress(progress).then(() => {
        this.displayProgress()
      })
      this.updateProgressBg()
      saveProgress(this.fileName, progress)
    }, // 拖动结束
    displayProgress () {
      const percentage = this.progress / 100
      // 获取位置的方法 this.locations.cfiFromPercentage(percentage)
      // 进度从0往后的时候，才会开始跳动位置 值为0的时候，默认为首页
      const cfi = this.currentBook.locations.cfiFromPercentage(percentage)
      const location = percentage > 0 ? cfi : 0
      this.display(location)
      this.refreshLocation()
    }, // 展示拖动对应章节
    onProgressInput (progress) {
      this.setProgress(progress).then(() => {
        this.displayProgress()
      })
      this.updateProgressBg()
      saveProgress(this.fileName)
    }, // 拖动过程
    updateProgressBg () {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    }, // 更新进度条背景颜色
    prevSection () {
      // 0 表第一章节 1 表第二章节
      if (this.section > 0 && this.bookAvailable) {
        this.setSection(this.section - 1).then(() => {
          this.displaySection()
        })
      }
    }, // 上一章节
    nextSection () {
      // spine 表示阅读章节，阅读进度的集合
      if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
        this.setSection(this.section + 1).then(() => {
          this.displaySection()
        })
      }
    }, // 下一章节
    displaySection () {
      // sectionInfo 是上一章节的所有数据
      const sectionInfo = this.currentBook.section(this.section)
      if (sectionInfo && sectionInfo.href) {
        this.display(sectionInfo.href)
        this.refreshLocation()
      }
    } // 展示章节内容
  },
  updated () {
    this.updateProgressBg()
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "../../assets/styles/global";
    .setting-wrapper{
        position: absolute;
        bottom: px2rem(48);
        left: 0;
        z-index: 190;
        width: 100%;
        height: px2rem(90);
        background: white;
        box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
        .setting-progress{
            position: relative;
            width: 100%;
            height: 100%;
            .read-time-wrapper{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: px2rem(40);
                font-size: px2rem(12);
                @include center;
                .read-time-text{}
            }
            .progress-wrapper{
                width: 100%;
                height: 100%;
                @include center;
                padding: 0 px2rem(15);
                box-sizing: border-box;
                .progress-icon-wrapper{
                    font-size: px2rem(20);
                }
                .progress{
                    flex: 1;
                    width: 100%;
                    height: px2rem(2);
                    /* 浏览器默认样式 */
                    -webkit-appearance: none;
                    /* 指定range的俩种颜色，颜色切换，需要在方法中设置background-size的首个参数 */
                    // background: -webkit-linear-gradient(#999, #999) no-repeat #dddddd;
                    /* #ddd指的是背景颜色 linear-gradient设置的是background-image属性的值 */
                    // background-size: 0 100%!important;
                    margin: 0 px2rem(10);
                    &:focus {
                        outline: none;
                    }
                    /* 这是range的按钮的形状 */
                    &::-webkit-slider-thumb{
                        -webkit-appearance: none;
                        height: px2rem(20);
                        width: px2rem(20);
                        border-radius: 50%;
                        background: white;
                        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
                        border: px2rem(1) solid #dddddd;
                    }
                }
                .progress-icon-wrapper {
                    flex: 0 0 px2rem(22);
                    font-size: px2rem(22);
                    @include center;
                }
            }
            .text-wrapper{
                position: absolute;
                left: 0;
                bottom: px2rem(10);
                width: 100%;
                font-size: px2rem(12);
                text-align: center;
                padding: 0 px2rem(15);
                box-sizing: border-box;
                @include center;
                .progress-section-text{
                    @include ellipsis;
                }
            }
        }
    }

</style>
