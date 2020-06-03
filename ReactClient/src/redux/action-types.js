/**
 * 将 action 和 reducer 结合起来的 type 常量
 */

// 用户信息的状态
export const AUTH_SUCCESS = "auth_success";     // 注册/登录成功
export const ERROR_CODE = "error_code";         // 没有登录的状态
export const RESET_USER = "reset_user";         // 清空用户信息的状态


// 用户列表的状态
export const RECEIVE_USER_LIST = "receive_user_list";   // 接受用户列表


// 消息
export const RECEIVE_MSG_LIST = "receive_msg_list";   // 接受所有相关的消息列表
export const RECEIVE_MSG = "receive_msg";   // 接受一条消息  
export const RESET_MSG = "reset_msg";


// 未读消息设置为已读
export const MSG_READ = 'msg_read'