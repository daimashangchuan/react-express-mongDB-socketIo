/**
 * 个人中心组件
 */

import React, { Component } from 'react';
import { connect } from "react-redux";
import { getUserInfo, setResetUser, setResetMsg } from "../../redux/actions"

import { Result, List, WhiteSpace, Button, Modal } from "antd-mobile";
import { Brief } from 'antd-mobile/lib/list/ListItem';

import Cookies from "js-cookie"

const Item = List.Item;
class Personal extends Component {


    /**
     * 退出登录
     */
    logout = () => {
        Cookies.remove("SOCKETIO_TOKEN");
        this.props.setResetUser();
        this.props.setResetMsg();
    }   

    /**
     * 退出登录的弹框
     */
    handleLogout = () => {
        Modal.alert('退出', "确认退出登录吗？", [
            { text: '退出', onPress: () => console.log("cancel") },
            { text: '确认', onPress: () => { this.logout() } }
        ])
    }


    render() {

        const { userInfo } = this.props;
        
        return (
            <div>
                <Result img={ <img src={ require('../../components/header-selector/images/头像1.png') } style={{width: '50px'}} alt="头像"/> }  
                    title={ userInfo.username } message={ userInfo.company } />
                {
                    userInfo.type === "laoban"?(
                        <List renderHeader={()=>'相关信息'}>
                            <Item multipleLine>
                                <Brief>职位：{ userInfo.post } </Brief>
                                <Brief>简介：{ userInfo.info }</Brief>
                                <Brief>资薪：{ userInfo.salary }</Brief>
                            </Item>
                        </List>
                    ):(
                        <List renderHeader={()=>'相关信息'}>
                            <Item multipleLine>
                                <Brief>职位：{ userInfo.post } </Brief>
                                <Brief>简介：{ userInfo.info }</Brief>
                            </Item>
                        </List>
                    )
                }    
                
                <WhiteSpace />
                <List>
                    <Button type='warning' onClick={ this.handleLogout }>退出登录</Button>
                </List>
            </div>
        );
    }
}

export default connect(
    state => ({ userInfo: state.userInfo }),
    { getUserInfo, setResetUser, setResetMsg }
)(Personal);