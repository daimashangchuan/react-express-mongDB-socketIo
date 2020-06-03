/**
 * 消息组件
 */

import React, { Component } from 'react';
import { connect } from "react-redux";
import { List, Badge } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

const Item = List.Item;
const Brief = Item.Brief;

/**
 *  对 chatMsgs 按 chat_id 进行分组, 并得到每个组按时间排序的最后一个数组（lastMsg）
 *  并且将未读的信息保存到 最后一个数组中去
 *      1. 找出每个聊天的 lastMsg，并用一个对象容器来保存{ chat_id:lastMsg }
 *      2. 得到所有lastMsg的数组
 *      3. 对数组进行排序(按 ccreated_time 降序)
 */
function getLastMsgs(chatMsgs, userid) {
    //  1. 找出每个聊天的 lastMsg，并用一个对象容器来保存{ chat_id:lastMsg }
    const lastmsgObjs = {};
    chatMsgs.forEach(msg => {

        // msg 进行个体的统计
        if(userid === msg.to && !msg.read) {
            msg.unReadCount = 1
        } else {
            msg.unReadCount = 0
        }

        // 得到 msg 聊天标识 id
        const chatId = msg.chat_id;
        // 获取已保存的当前组件的 lastMsg
        const lastMsg = lastmsgObjs[chatId];
        // 判读有没有这个聊天记录，没有直接赋值，有就排序
        if(!lastMsg) {
            lastmsgObjs[chatId] = msg;
        } else {
            // 保存已经统计的未读数量 unReadCount = 已经统计的 + 当前 msg 的
            const unReadCount = lastMsg.unReadCount + msg.unReadCount;  
            if(msg.create_time>lastMsg.create_time) {
                lastmsgObjs[chatId] = msg;
            }
            // 将 unReadCount 并保存在最新 lastMsg 上
            lastmsgObjs[chatId].unReadCount = unReadCount;
        }
    })

    //  2. 得到所有lastMsg的数组
    const lastMsgs = Object.values(lastmsgObjs)

    // 3. 对数组进行排序(按 ccreated_time 降序)
    lastMsgs.sort(function(a, b){
        return a.create_time - b.create_time;
    })

    return lastMsgs
}   


class Message extends Component {

    render() {

        const { chat, userInfo } = this.props;
        const { users, chatMsgs } = chat
        console.log(chat)

        // 对 chatMsg 按 chat_id 进行分组
        const lastMsgs = getLastMsgs(chatMsgs, userInfo._id)
        console.log('lastMsgs', lastMsgs)
        return (
            <List>
                <QueueAnim type='bottom'>
                {
                    lastMsgs.map(msg => {
                        const chatId = msg.to === userInfo._id? msg.from : msg.to;
                        const targetUser = users[chatId];
                        return (
                            <Item key={ msg._id } extra={ <Badge text={ msg.unReadCount } /> } arrow='horizontal'
                                thumb={ targetUser.header? require(`../../components/header-selector/images/${targetUser.header}`) : null }
                                onClick={ () => this.props.history.push(`/chat/${chatId}`) } >
                                { msg.content } <Brief>{ targetUser.username }</Brief>
                            </Item>
                        )
                    })
                }
                </QueueAnim>
            </List>
        );
    }
}

export default connect(
    state => ({ userInfo: state.userInfo, chat: state.chat })
)(Message);


