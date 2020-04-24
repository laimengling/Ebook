# vue-ebook

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
## 学习新知识
### 字体图标的准备
1. 图标可以在[iconfont](https://www.iconfont.cn/search/index?q=close)中查找到
2. 图标可以从本地上传到[iconMoon](https://icomoon.io/app/#/select/font)转换为font字体文件
### web字体
####字体的查找位置
1. 字体可以在fonts Google中查找
#### 字体的引入
- (文件置于public)在index.html中直接像其他的css一样引入，但是在开发环境下，文件位置会有所不同
```
  <link rel="stylesheet" href="<%= BASE_URL %>fonts/cabin.css">
```
- (文件置于asset)在main.js中导入
```
    import './assets/fonts/daysOne.css'
```
### rem 设置
1. rem的初始考虑
    - 在js中判定跟像素的字体大小
    - 在css中计算具体的rem
```
   document.addEventListener('DOMContentLoaded', () => {
     const html = document.querySelector('html')
     let fontSize = window.innerWidth / 10
     fontSize = fontSize > 50 ? 50 : fontSize
     html.style.fontSize = fontSize + 'px'
   })
```
> 在实际开发中，需要计算，麻烦
2. rem直接写入px像素，根据px像素转换为rem
    - 在global中添加方法
    - 需要使用的地方添加引入global.scss文件即可
    - 方法：
```
$ratio: 375 / 10;
@function px2rem($px) {
  @return $px / $ratio + rem;
}
```
### vuex的引入
1. 在vue/cli 4 与vue/cli 3的vuex与router的不同：默认目录结构已更改
    `src/store.js`改为 `src/store/index.js`
    `src/router.js`改为 `src/router/index.js`
2. vuex应用的核心就是 store（仓库）。“store”基本上就是一个容器，它包含着你的应用中大部分的状态 (state)。属性：
    - state:不可直接改变state的属性，唯一修改状态的途径是mutation
    - mutation
        - 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数
        - 调用mutation的函数 `store.commit('函数名')`
        -  **必须同步执行**
    - actions：类似于mutation，不同：
        - Action 提交的是 mutation，而不是直接变更状态。
        - Action 可以包含**任意异步操作**。
        - 分发action等好看官方网站[vuex](https://vuex.vuejs.org/zh/guide/actions.html)
    - modules
        - 模块化：在使用store的时候，如果含有大量的数据，将变得臃肿，因此切割为模块
        - 使用： `this.$route.state.book.test`十分繁琐
            - 改进,使用`mapGetters`
                - 创建getter.js文件，将数据暴露出来 ` test: state => state.book.test`
                - 在需要使用的地方引入： `import { mapGetters } from 'vuex'`
                - 在js中使用
                `computed: {...mapGetters(['test'])},`
                - 使用的时候，直接使用 `this.test`
    - 模块化时， `...mapGetters['test']`
                 
### epubjs
1. epubjsuanran出来的书籍页面，是显示在iframe当中
    - 我们无法在外部页面引入css文件，而iframe内的样式变化
        - 因此在初始化渲染页面的地方，加载所需要的css文件
        - 在需要修改字体类型的地方修改名称
        `this.currentBook.rendition.themes.font(字体类型)`
```
    this.rendition.hooks.content.register(contents => {
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`)
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/Cabin.css`)
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/Montserrat.css`)
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/Tangerine.css`)
            // addStylesheet 参数必须是路径，为了在开发后，环境变量统一加载到用户中，添加.env.development
            // 使用过程中注意需要重新关闭服务器
          })
```  
2. 主题设置功能实现
    - 实现原理： `this.thems.register(name, styles)`  `this.themes.select(name)`
3. 阅读进度功能实现
    - 实现的对象： `this.book.locations`消耗性能，默认不生成
    - 改进方法：epubjs的钩子函数 
```
    this.book.ready.then(() = >{
        return this.book.locations.generate()
    }).then(result => {
        this.locations = this.book.locations
    })
```
## 项目开发踩坑
### vue.config.js配置
1. vue的路径问题
    - @vue/cli 3.3版本之前： `baseUrl`
    - @vue/cli 3.3版本之后： `publicPath`
### es-lint使用
1. 出现错误 `Newline required at end of file but not found  eol-last`
    解决：在最后一行后面加回车
### epubjs使用
1. 在开发时“touchstart”，“touchend”无法被触发的情况
    解决：更新epubjs到指定版本 `cnpm update epubjs@0.3.71 -S`
    最终解决：上方百度结果对项目在谷歌运行未起作用，因此在渲染页面加上mask，分区点击实现翻页效果
