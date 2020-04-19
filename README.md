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

## 项目开发踩坑
### vue.config.js配置
1. vue的路径问题
    - @vue/cli 3.3版本之前： `baseUrl`
    - @vue/cli 3.3版本之后： `publicPath`
