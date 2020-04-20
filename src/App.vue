<template>
    <div id="app">
        <span class="text">ABCDEF</span>
        <router-view/>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['test'])
  },
  mounted () {
    this.$store.dispatch('setTest', 1).then(() => {
      console.log(this.test)
    })
  }
}
// rem设置，自适应布局实现,设置字体最大1rem=50px
document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  html.style.fontSize = fontSize + 'px'
})
</script>
<style scoped lang="scss">
    @import "./assets/styles/global.scss";

    .text {
        font-family: 'Days One';
        font-size: px2rem(20);
        color: orange;
    }
</style>
