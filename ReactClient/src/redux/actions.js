/**
 * 包含多个 action 
 *      同步
 *      异步
 */

import io from "socket.io-client"; 

import { 
    AUTH_SUCCESS, 
    ERROR_CODE, 
    RESET_USER, 
    RECEIVE_USER_LIST, 
    RECEIVE_MSG_LIST, 
    RECEIVE_MSG, 
    RESET_MSG,
    MSG_READ } from "./action-types";
import { reqUserInfo, reqUserList, reqMsgList, reqReadMsg } from "../api"

import { SOCKET_URL } from '../api/config';


// 授权成功的同步 action 
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user});
// 授权成功但是没有登录的同步 action 
const errorCode = (code) => ({type: ERROR_CODE, data: code});
// 清空用户信息的同步 action
const resetUser = (data) => ({type: RESET_USER, data});

// 接收用户列表的同步 action
const receiveUserList = (data) => ({type: RECEIVE_USER_LIST, data});

// 接收消息列表的同步 action
const receiveMsgList = (data) => ({type: RECEIVE_MSG_LIST, data});
// 接受一条消息的同步 action
const receiveMsg = (data) => ({type: RECEIVE_MSG, data});
// 清空消息列表
const resetMsg = (data) => ({type: RESET_MSG, data});


// 未读消息设置位已读消息
const msgRead = (data) => ({type: MSG_READ, data}); 

// 获取用户数据
export const getUserInfo = () => {
    return async dispatch => {
        // 发送登录的异步ajax请求
        const { data, code } = await reqUserInfo();
        if(code === 0) {
            getMsgList(dispatch, data._id);
            dispatch(authSuccess(data));   
        } else if(code === 404){
            dispatch(errorCode(code)); 
        }
    }
}


// 清空用户数据
export const setResetUser = () => {
    return async dispatch => {
        dispatch(resetUser('')); 
    }
}


// 获取用户列表  老板取大神/大神取老板
export const getUserList = (type) => {
    return async dispatch => {
        // 发送登录的异步ajax请求
        const { data, code } = await reqUserList(type);
        if(code === 0) {
            dispatch(receiveUserList(data));
        }
    }
}


/**
 *  单例对象
 *      创建对象之前：判断对象是否已经存在，只有不存在才去创建
 *          连接服务器，得到与服务器的连接对象
 *          绑定监听，接受服务器发送的消息
 *      创建对象之后：保存对象
 */
// 获取 userId
function initIO(dispatch, userid) {
    if(!io.socket) {
        io.socket = io(SOCKET_URL);
        io.socket.on('recieveMsg', function(chatMsg) {
            // 只有当 chatMsg 是与当前用户相关的消息，才去分发同步 action 保存消息
            if(userid === chatMsg.from || userid === chatMsg.to) {
                // console.log('客户端接收服务器发送的消息', chatMsg);
                dispatch(receiveMsg({ chatMsg, userid }))
            }
        })
    }   
}


/**
 * 异步获取消息列表数据
 */
async function getMsgList(dispatch, userid) {
    await initIO(dispatch, userid);
    const { data, code } = await reqMsgList();
    if(code === 0) {
        const { users, chatMsgs } = data;
        // 分发同步 action
        dispatch(receiveMsgList({ users, chatMsgs, userid }))
    }
}


// 发送信息的异步 action
export const sendMsg = ({ from, to, content }) => {
    return async dispatch => {
        console.log('客户端向服务器发送的消息', { from, to, content });
        io.socket.emit('sendMsg', { from, to, content })
        getMsgList(dispatch, from)
    }
}


// 清空信息的异步
export const setResetMsg = () => {
    return async dispatch => {
        dispatch(resetMsg('')); 
    }
}


//  设置未读消息为已读 action
export const readMsg = (from, to) => {
    return async dispatch => {
        const { data, code } = await reqReadMsg(from);
        console.log(data, code);
        if(code === 0) {
            const count = data;
            dispatch(msgRead({ count, from, to })); 
        }
    }
}








