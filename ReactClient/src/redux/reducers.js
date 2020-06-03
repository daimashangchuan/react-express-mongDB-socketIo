/**
 * 包含多个 reducer 函数：根据老的 stat 和指定的 action 返回一个新的 state
 */

import { combineReducers } from "redux";
import { 
    AUTH_SUCCESS, 
    ERROR_CODE, 
    RESET_USER, 
    RECEIVE_USER_LIST, 
    RECEIVE_MSG_LIST, 
    RECEIVE_MSG, 
    RESET_MSG,
    MSG_READ } from "./action-types";
import { getRedirectTo } from "../utils";
/**
 * 产生 userInfo 状态的 reducer 函数
 */
function userInfo (state = {}, action) {
    switch(action.type) {
        case AUTH_SUCCESS:
            const { type, header } = action.data
            const redirectTo = getRedirectTo(type, header)
            // console.log("redux状态保存的用户数据跟新为：", { ...action.data, redirectTo });
            return { ...action.data, redirectTo };
        case ERROR_CODE:  
            //  404 代表没有登录
            return { ...action.data, redirectTo: '/login' }
        case RESET_USER:
            return null    
        default:
            return state;
    }
}


/**
 * 产生 userList 状态的 reducer 函数
 */
function userList (state = [], action) {
    switch(action.type) {
        case RECEIVE_USER_LIST:
            return action.data;
        default:
            return state;
    }
}


const initChat = {
    users: {},       // 所有用户信息的对象
    chatMsgs: [],   // 当前用户所有相关 msg 的数组
    unReadCount: 0  // 总的未读数量
}
/**
 * 产生聊天状态的 reducer
 */
function chat(state=initChat, action) {
    switch(action.type) {
        case RECEIVE_MSG_LIST:
            const { users, chatMsgs, userid } = action.data;
            return {
                users,       
                chatMsgs,  
                unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal + (!msg.read && userid === msg.to? 1: 0), 0)
            };
        case RECEIVE_MSG:
            const { chatMsg } = action.data;
            return {
                users: state.users,       
                chatMsgs: [...state.chatMsgs, chatMsg],  
                unReadCount: state.unReadCount + (!chatMsg.read && action.data.userid === chatMsg.to? 1: 0)
            };
        case MSG_READ: 
            const { from, to, count } = action.data;
            state.chatMsgs.forEach(msg => {
                if(msg.from === from && msg.to === to && !msg.read) {
                    msg.read = true
                }
            })
            return {
                users: state.users,
                chatMsgs: state.chatMsgs.map(msg => {
                    // 判断是否需要跟新       
                    if(msg.from === from && msg.to === to && !msg.read) {
                        msg.read = true
                    }
                    return msg
                }),  
                unReadCount: state.unReadCount - count
            };
        case RESET_MSG:
            return null;
        default:
            return state;
    }
}   


// 向外暴露的结构 { userInfo: {}, userList: []  }
export default combineReducers({
    userInfo,
    userList,
    chat
})

















