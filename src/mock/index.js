import Mock from 'mockjs'
import BookHomeApi from './bookHome'
import BookHomeList from './bookList'

// Mock.setup({
//   timeout: '350-600'
// })

Mock.mock(/\/book\/home/, 'get', BookHomeApi)
Mock.mock(/\/book\/list/, 'get', BookHomeList)

export default Mock
