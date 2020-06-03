/**
 * 主路由组件
 */

import React, { Component } from 'react';
import {  Route, Switch, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { getRedirectTo } from "../../utils";

import DashenInfo from "../dashen-info/dashen-info";
import LaobanInfo from "../laoban-info/laoban-info";
import Dashen from "../dashen/dashen";
import Laoban from "../laoban/laoban";
import Message from "../message/message";
import Personal from "../personal/personal";
import Chat from "../chat/chat"
import NotFound from "../../components/not-found/not-found";
import NavFooter from "../../components/nav-footer/nav-footer";


import { getUserInfo } from "../../redux/actions";
import Cookies from "js-cookie";
import { NavBar } from 'antd-mobile';

class Main extends Component {

    navList = [
        {
            path: '/laoban',
            component: Laoban,
            title: '大神列表',
            icon: 'dashen',
            text: '大神'
        },{
            path: '/dashen',
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板'
        },{
            path: '/message',
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息'
        },{
            path: '/personal',
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人'
        }
    ]

    render() {

        // 没有 cookie 信息就去登录
        const userId = Cookies.get('SOCKETIO_TOKEN');
        if(!userId) {
            return <Redirect to='/login'/>;
        }   
        
        // 如果根路径为 / 重定向到跳转的页面
        const { userInfo } = this.props;
        if(userInfo && userInfo._id) {
            let path = this.props.location.pathname; 
            if(path === "/") {
                path = getRedirectTo(userInfo.type, userInfo.header);
                return <Redirect to={ path } />;
            }
        } else {
            this.props.getUserInfo();
        }

        let { navList } = this;
        const path = this.props.location.pathname; 
        const currentNav = navList.find(nav => nav.path === path)

        if(currentNav) {
            navList.map(nav=> nav.hide = false);
            if(userInfo.type === "laoban") {
                navList[1].hide = true;
            } else {
                navList[0].hide = true;
            }
        }
        
        // 将总未读数传到 navFooter
        const { chat } = this.props;
        let unReadCount;
        if(chat) {
            unReadCount = chat.unReadCount;
        } else {
            unReadCount = 0;
        }

        return (
            <div>
                { currentNav? <NavBar>{ currentNav.title }</NavBar>: null }
                <div  style={{ padding: '45px 0 65px' }}>
                    <Switch>
                        {
                            navList.map(nav => <Route path={ nav.path } component={ nav.component } key={ nav.path }></Route>)
                        }
                        <Route path='/laobaninfo' component={ LaobanInfo }></Route>
                        <Route path='/dasheninfo' component={ DashenInfo }></Route>
                        <Route path='/chat/:userid' component={ Chat }></Route>
                        <Route component={ NotFound }></Route>
                    </Switch>
                </div>
                { currentNav? <NavFooter navList={ navList } unReadCount={ unReadCount }></NavFooter>: null }
            </div>
        );
    }
}

export default connect(
    state => ({ userInfo: state.userInfo, chat: state.chat }),
    { getUserInfo }
)(Main);


/**
 *  实现自动登录
 *      如果 cookie 中有 SOCKETIO_TOKEN，发送请求获取对应的 user
 *      如果 cookie 中没有 SOCKETIO_TOKEN，自动进入 login 界面
 *  如果已经登录，如果请求跟路径
 *      根据 user 的 type 和 header 来计算出一个重定向的路由路径，并自动重定向
 */


