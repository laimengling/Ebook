import Vue from 'vue'
import VueRouter from 'vue-router'
import Ebook from '../views/ebook/index.vue'
import EbookReader from '../components/ebook/EbookReader.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/ebook'
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
  }
]

const router = new VueRouter({
  routes
})

export default router
