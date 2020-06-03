/**
 * Storage 的封装
 */
//存储  
export const setStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}
//取出数据
export const getStorage = (key) =>  {
    return JSON.parse(localStorage.getItem(key));
}
// 删除数据
export const removeStorage = (key) => {
    localStorage.removeItem(key);
}



