
//输出通用axios实例
import axios from 'axios';
import qs from 'qs'
 

const baseURL = '/api' // 公共请求头
const timeout = 20000// 请求超时时间
const axiosInstance = axios.create({
  timeout,
  baseURL,
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  }
});


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // config.url = `${process.env.NODE_ENV === "development" ? '/url' : 'http://47.115.162.68:8762'}/api${config.url}`
  config.url =   'http://47.115.162.68:8762' 
  config.method === 'post' ? JSON.stringify(config.data) : config.params
  // config.headers['Content-Type'] = 'application/json'   
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded' 
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
   
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

// 暴露
export default axiosInstance
