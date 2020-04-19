<template>
    <div id="app">
        <span class="text">ABCDEF</span>
        <router-view/>
    </div>
</template>
<script>
export default {}
// rem设置，自适应布局实现,设置字体最大1rem=50px
document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  html.style.fontSize = fontSize + 'px'
})
</script>
<style scoped>
    .text {
        font-family: 'Days One';
        font-size: 1rem;
        color: orange;
    }
</style>
