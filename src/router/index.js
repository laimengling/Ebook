import Vue from 'vue'
import VueRouter from 'vue-router'
import Ebook from '../views/ebook/index.vue'
import EbookReader from '../components/ebook/EbookReader.vue'
import index from '../views/store/index'
import StoreHome from '../views/store/StoreHome'
import StoreList from '../views/store/StoreList'
import StoreDetail from '../views/store/StoreDetail'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/store'
  },
  {
    path: '/ebook',
    component: Ebook,
    children: [
      {
        path: ':fileName',
        component: EbookReader
      }
    ]
  },
  {
    path: '/store',
    component: index,
    redirect: '/store/home',
    children: [
      {
        path: 'home',
        component: StoreHome
      },
      {
        path: 'list',
        component: StoreList
      },
      {
        path: 'detail',
        component: StoreDetail
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
