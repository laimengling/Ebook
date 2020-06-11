<template>
    <div>
        <div class="search-bar" :class="{'hide-title' : !titleVisible, 'hide-shadow' : !shadowVisible}">
            <transition name="title-move">
            <div class="search-bar-title-wrapper" v-show="titleVisible">
                <div class="title-text-wrapper">
                    <span class="title-text title">{{$t('home.title')}}</span>
                </div>
                <div class="title-icon-shake-wrapper" @click="switchLanguage">
                    <span class="icon-cn icon"  v-if="lang === 'cn'"></span>
                    <span class="icon-en icon"  v-else></span>
                </div>
            </div>
            </transition>
            <div class="title-icon-back-wrapper"
                 :class="{'hide-title':!titleVisible}"
                 @click="back"
            >
                <span class="icon-back icon"></span>
            </div>
            <div class="search-bar-input-wrapper" :class="{'hide-title':!titleVisible}">
                <div class="search-bar-blank" :class="{'hide-title':titleVisible}"></div>
                <div class="search-bar-input">
                    <span class="icon-search icon"></span>
                    <input type="text" class="input"
                           :placeholder="$t('home.hint')"
                           v-model="searchText"
                           @click = "showHotSearch"
                           @keyup.13.exact="search"
                    >
                </div>
            </div>
        </div>
        <hot-search-list v-show="hotSearchVisible" ref="hotSearch"></hot-search-list>
    </div>
</template>

<script>
import { storeHomeMixin } from '../../util/mixin'
import HotSearchList from './HotSearchList'
import { setLocalStorage } from '../../util/localStorage'

export default {
  mixins: [storeHomeMixin],
  components: {
    HotSearchList
  },
  data () {
    return {
      searchText: '',
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false
    }
  },
  watch: {
    offsetY (offsetY) {
      if (offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    hotSearchOffsetY (offsetY) {
      if (offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
    }
  },
  methods: {
    switchLanguage () {
      if (this.lang === 'cn') {
        this.$i18n.locale = 'en'
      } else {
        this.$i18n.locale = 'cn'
      }
      setLocalStorage('locale', this.$i18n.locale)
    },
    search () {
      this.$router.push({
        path: '/store/list',
        query: {
          keyword: this.searchText
        }
      })
    },
    hideTitle () {
      this.titleVisible = false
    },
    showTitle () {
      this.titleVisible = true
    },
    hideShadow () {
      this.shadowVisible = false
    },
    showShadow () {
      this.shadowVisible = true
    },
    hideHotSearch () {
      this.hotSearchVisible = false
      if (this.offsetY > 0) {
        this.showTitle()
        this.hideTitle()
      } else {
        this.hideTitle()
        this.showTitle()
      }
    },
    showHotSearch () {
      this.hideTitle()
      this.hideShadow()
      this.hotSearchVisible = true
      this.$nextTick(() => { // 当这个方法结束后调用
        this.$refs.hotSearch.reset()
      })
    },
    back () {
      if (this.offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
      this.hideHotSearch()
    }
  },
  computed: {
    lang () {
      return this.$i18n.locale
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "../../assets/styles/global";
    .search-bar{
        position: relative;
        z-index: 150;
        width: 100%;
        height: px2rem(94);
        box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0,0,0,.2);
        &.hide-title{
            height: px2rem(52);
        }
        &.hide-shadow{
            box-shadow: none;
        }
        .search-bar-title-wrapper{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: px2rem(42);
            .title-text-wrapper{
                width: 100%;
                @include center;
                height: px2rem(42);
                .title-text{}
            }
            .title-icon-shake-wrapper{
                position: absolute;
                right: px2rem(15);
                top: 0;
                z-index: 220;
                height: px2rem(42);
                @include center;
            }
        }
        .title-icon-back-wrapper{
            position: absolute;
            left: px2rem(15);
            top: 0;
            z-index: 200;
            height: px2rem(42);
            @include center;
            transition: height $animationTime $animationType;
            &.hide-title{
                height: px2rem(52);
            }
        }
        .search-bar-input-wrapper{
            position: absolute;
            left: 0;
            top: px2rem(42);
            display: flex;
            width: 100%;
            height: px2rem(52);
            padding: px2rem(10);
            box-sizing: border-box;
            transition: top $animationTime $animationType;
            &.hide-title{
                top:0;
            }
            // 占位符
            .search-bar-blank{
                flex: 0 0 px2rem(31);
                width: px2rem(31);
                transition: all $animationTime $animationType;
                &.hide-title{
                    flex: 0  0 0;
                    width: px2rem(0);
                }
            }
            .search-bar-input{
                flex: 1;
                width: 100%;
                background: #f4f4f4;
                border-radius: px2rem(20);
                padding: px2rem(5) px2rem(15);
                box-sizing: border-box;
                border: px2rem(1) solid #eeeeee;
                @include left;
                .icon-search{}
                .input{
                    width: 100%;
                    height: px2rem(22);
                    border: none;
                    background: transparent;
                    margin-left: px2rem(10);
                    font-size: px2rem(12);
                    color: #666666;
                    &:focus{
                        outline: none;
                    }
                    &::-webkit-input-placeholder{
                        color: #cccccc;
                    }
                }
            }
        }
    }
</style>
