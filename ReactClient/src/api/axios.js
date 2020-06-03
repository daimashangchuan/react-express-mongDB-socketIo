/**
 *  封装请求的方法
 */
import axios from "axios";
import qs from 'qs';
import { BASE_URL } from "./config"




// axios.create({
// 	headers: {
// 		"Content-Type": "application/json;charset=UTF-8"
// 	}
// });
// axios.withCredentials = true;           
axios.defaults.withCredentials = true;  // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息

/**
 *  请求接口之前
 */
axios.interceptors.request.use((request) => {
  request.data = qs.stringify(request.data)
  return request;
});


/**
 *  请求接口之后 (响应)
 */
axios.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    return Promise.reject(error)
})

function ajax(url, type="POST", data = {}) {
  url = BASE_URL + url;
  if(type === "GET") {
    let paramStr = '';
    Object.keys(data).forEach(key=> {
      paramStr += key + "=" + data[key] + "&"
    })
    if(paramStr) {
      paramStr = paramStr.substring(0, paramStr.length-1)
    }
    return axios.get(url + '?' + paramStr);
  } else if(type === "POST") {
    return axios.post(url, data)
  }
}


export default ajax




