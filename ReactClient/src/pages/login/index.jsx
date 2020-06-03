/**
 * 登录路由组件
 */

import React, { Component } from 'react';

import { connect } from "react-redux";
import { getUserInfo } from "../../redux/actions";

import { NavBar, WingBlank, List, InputItem, WhiteSpace, Button, Toast } from "antd-mobile";
import md5 from "blueimp-md5";
import Cookies from "js-cookie"

import { reqLogin } from "../../api"
import Logo from "../../components/logo/logo"
import "./login.less"

class Login extends Component {

    state = {
        username: "",       // 用户名
        password: "",       // 密码
    }

    /**
     * 收集登录数据
     */
    handleChange = (name, val) => {
        // [] 将 name 设置为变量
        if(name === "password") {
            val = md5(val)
        }
        this.setState({
            [name]: val 
        })
    }

    /**
     * 去注册
     */
    toRegister = () => {
        this.props.history.replace("/register");
    }

    /**
     * 登录按钮
     */
    login = async () => {
        const { username, password } = this.state
        if(username === '') {
            Toast.fail("用户名不能为空");
            return;
        } else if(password === ''){
            Toast.fail("密码不能为空");
            return;
        } else {
            this.setState({
                password: md5(password)
            })
        }
        const { code , msg, data } = await reqLogin({ username, password })
        if(code === 0) {
            Toast.success(msg, 1);
            Cookies.set('SOCKETIO_TOKEN', data._id, { expires: 7 });
            this.props.getUserInfo();
            this.props.history.replace("/");
        } else {
            Toast.fail(msg);
        }  
    }

    render() {

        return (
            <div className='login-box'>
                <NavBar>react 直 聘</NavBar>
                <Logo></Logo>
                <WingBlank>
                    <List>  
                        <InputItem onChange={ val => { this.handleChange("username", val) } } placeholder="请输入用户名">用户名：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem onChange={ val => { this.handleChange("password", val) } } type="password" placeholder="请输入密码">密&nbsp;&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <Button type="primary" onClick={ this.login }>登&nbsp;&nbsp;&nbsp;录</Button>
                        <WhiteSpace></WhiteSpace>
                        <Button type="ghost" onClick={ this.toRegister }>还没有账户</Button>
                    </List>
                </WingBlank>
            </div>
        );
    }
}

export default connect(
    state => ({ userInfo: state.userInfo }),
    { getUserInfo }
)(Login);


