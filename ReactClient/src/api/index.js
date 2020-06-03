/**
 * 接口存放的 js 文件
 */

import ajax from "./axios"

/**
 * 注册接口
 * @username {*} 用户名
 * @password {*} 密码
 * @password2 {*} 确认密码  
 * @type {*} 用户类型
 */
export const reqRegister = ({ username, password, password2, type }) => ajax("/register", "POST", { username, password, password2, type })


/**
 * 登录接口
 * @username {*} 用户名
 * @password {*} 密码
 */
export const reqLogin = ({ username, password }) => ajax("/login", "POST", { username, password })

/**
 * 跟新用户信息接口
 * @header {*}  头像名称 
 * @post {*}    职位  
 * @info {*}    个人或职位简介
 * @company {*} 公司名称
 * @salary {*}  月薪 
 */
export const reqUpdata = ({ header, post, info, company, salary  }) => ajax("/update", "POST", { header, post, info, company, salary  })

/**
 * 获取用户信息接口
 */
export const reqUserInfo = () => ajax("/userinfo", "POST")


/**
 * 获取用户列表（指定类型）
 * @type {*}  用户类型
 */
export const reqUserList = (type) => ajax("/userList", "GET",{ type })


/**
 * 获取聊天信息列表
 */
export const reqMsgList = () => ajax("/msglist", "GET")


/**
 * 修改指定消息位已读
 * @from {*}  发送消息的 _id
 */
export const reqReadMsg = (from) => ajax("/readmsg", "POST", { from })


