import axios from './axios'

// 允许跨域携带cookie
axios.defaults.withCredentials = true;

// 请求单个 股票信息
// export const reqGetRedisStock = (prodCode) => axios({
//   url:'/quotationService/quotation/getRedisStock',
//   method:'POST',
//   data:{
//     prodCode:prodCode
//   }
// })