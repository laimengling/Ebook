import axios from 'axios'

export function home () {
  return axios({
    methods: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}

export function list () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

export function detail (book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}
