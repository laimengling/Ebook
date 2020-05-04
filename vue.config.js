function mock (app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}

const homeData = require('./src/mock/bookHome')
const listData = require('./src/mock/bookList')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    before (app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/list', listData)
    }
  }
}
