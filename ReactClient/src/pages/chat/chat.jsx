/**
 * 聊天组件
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavBar, List, InputItem, Icon, Grid } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

import { sendMsg, readMsg } from '../../redux/actions'
import { emojis } from "../../utils"
import './index.less'

const Item = List.Item;

class Chat extends Component {

    state = {
        content: '',
        isShow: false
    }

    componentWillMount() {
        // 初始化表情的数据
        this.emojis = emojis.map(emoji => ({ text: emoji }));
    }

    componentDidMount() {
        // 初始化显示的消息列表
        window.scrollTo(0, document.body.scrollHeight);
    }

    componentWillUpdate() {
        // 跟新后显示的消息列表
        window.scrollTo(0, document.body.scrollHeight);
    }

    // 在卸载组件之前
    componentWillUnmount() {
        // 发请求更新消息的未读状态
        const from = this.props.match.params.userid;
        const to = this.props.userInfo._id;
        this.props.readMsg(from, to);
    }

    handleSend = () => {
        const from = this.props.userInfo._id;
        const to = this.props.match.params.userid;
        const content = this.state.content.trim();
        // 发送
        if(content) {
            this.props.sendMsg({ from, to, content })
        }
        this.setState({ content: '', isShow: false });
    }

    toogleShow = () => {
        const isShow = !this.state.isShow;
        this.setState({ isShow });
        if(isShow) {
            // 异步手动派发 resize 时间， 解决表情列表的 bug
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 0)
        }
    }


    render() {

        const { userInfo } = this.props;
        const { users, chatMsgs } = this.props.chat;
        // 计算当前聊天的 chatId
        const meId = userInfo._id;   //  获取当前用户的 id
        const targetId = this.props.match.params.userid;    // 获取目标用户的 id
        const chatId = [meId, targetId].sort().join('_');
        // 去除多余的请求
        if(users &&  !users[meId]) {
            return null
        }

        // 对 chatMsgs 进行过滤
        const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)
        // 找到和自己对话的信息
        const { username, header } = users[targetId]
        const targetHeader = require(`../../components/header-selector/images/${header}`);

        return (
            <div id='chat-page'>
                <NavBar icon={<Icon type="left" />} onLeftClick={ () => this.props.history.goBack() }>{ username }</NavBar>
                <List>
                    {/* alpha left right top bottom scale scaleBig scaleX scaleY */}
                    <QueueAnim type='right' delay={ 500 }>
                        {
                            msgs.map(msg => {
                                // 接受对方的信息
                                if(targetId === msg.from) {   
                                    return (
                                        <Item key={ msg._id } thumb={ targetHeader }>
                                            { msg.content }
                                        </Item>
                                    )
                                } else {
                                    return (
                                        <Item key={ msg._id } className='chat-me' extra='&nbsp;: 我'>
                                            { msg.content }
                                        </Item>
                                    )
                                }
                            })
                        }
                    </QueueAnim>
                </List>
                <div className='am-tab-bar'>
                    <InputItem placeholder='请输入' value={ this.state.content } 
                        onFocus = { () => this.setState({ isShow: false }) }
                        onChange={ (val) => this.setState({ content: val }) } 
                        extra={ 
                            <div>
                                <span onClick={ this.toogleShow } style={{ lineHeight: 1.2 }}>😊</span>
                                <span onClick={ this.handleSend }> 发送</span> 
                            </div>
                        }>
                    </InputItem>
                    {
                        this.state.isShow ? (
                            <Grid data={this.emojis} columnNum={8} carouselMaxRow={4} isCarousel={true}
                            onClick={ (item) => { this.setState({ content: this.state.content + item.text }) } }
                            ></Grid>
                        ): null
                    }    
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({ userInfo: state.userInfo, chat: state.chat }),
    { sendMsg, readMsg }
)(Chat);






