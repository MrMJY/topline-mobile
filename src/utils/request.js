const axios = require('axios')
const {
  getUser
} = require('./user')
const JSONbig = require('json-bigint')
// You can create a new instance of axios with a custom config.

const request = axios.create({
  // baseURL: 'http://toutiao.course.itcast.cn'
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// 响应数据格式转化，针对于数据超出安全范围等
// `transformResponse` allows changes to the response data to be made before
// it is passed to then/catch
request.defaults.transformResponse = [function (data) {
  // Do whatever you want to transform the data
  try {
    return JSONbig.parse(data)
  } catch (err) {
    return data
  }
}]

// You can intercept(拦截) requests or responses before they are handled by then or catch.
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  const user = getUser()
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Do something with response data
  // 如果响应结果对象中有 data，则直接返回这个 data 数据
  // 如果响应结果对象中没有 data，则不作任何处理，直接原样返回这个数据
  return response.data.data || response.data
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

export default request
