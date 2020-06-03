/**
 * 注册路由组件
 */

import React, { Component } from 'react';
import md5 from "blueimp-md5"
import { NavBar, WingBlank, List, InputItem, WhiteSpace, Radio, Button, Toast } from "antd-mobile";
import Logo from "../../components/logo/logo";
import "./register.less"

import { reqRegister } from "../../api"

const ListItem = List.Item;

class Rrgister extends Component {

    state = {
        username: "",       // 用户名
        password: "",       // 密码
        password2: "",      // 确认密码
        type: ""            // 用户类型名称  大神/老板
    }

    /**
     * 注册按钮
     */
    register = async () => {
        if(this.state.username === "" || this.state.password === "" || this.state.password2 === "" || this.state.type === "") {
            Toast.fail('必输项不能为空', 1);
            return
        } 
        const { code, msg } = await reqRegister(this.state)
        if(code === 0) {
            Toast.success(msg, 1);
            this.props.history.replace("/login");
        } else {
            Toast.fail(msg, 1);
        }
    }

    /**
     * 手机注册数据
     */
    handleChange = (name, val) => {
        // [] 将 name 设置为变量
        if(name === "password" || name === "password2") {
            val = md5(val)
        }
        this.setState({
            [name]: val 
        })
    }

    /**
     * 去登录
     */
    toLogin = () => {
        this.props.history.replace("/login")
    }

    render() {

        const { type } = this.state;

        return (
            <div className="register-container"> 
                <NavBar>react 直 聘</NavBar>
                <Logo></Logo>
                <WingBlank className="register-wing-blank">
                    <List>
                        <InputItem onChange={ val => { this.handleChange("username", val) } } placeholder="请输入用户名">用户名：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem onChange={ val => { this.handleChange("password", val) } } type="password" placeholder="请输入密码">密&nbsp;&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem onChange={ val => { this.handleChange("password2", val) } } type="password" placeholder="请输入确认密码">确认密码：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <ListItem>
                            <span>用户类型：</span>&nbsp;&nbsp;&nbsp;
                            <Radio checked={ type === "dashen" } onChange={ () => { this.handleChange("type", "dashen") }}>大神</Radio>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={ type === "laoban" } onChange={ () => { this.handleChange("type", "laoban") }}>老板</Radio>
                        </ListItem>
                        <WhiteSpace></WhiteSpace>
                        <Button type="primary" onClick={ this.register }>注&nbsp;&nbsp;&nbsp;册</Button>
                        <WhiteSpace></WhiteSpace>
                        <Button type="ghost" onClick={ this.toLogin }>已有账户</Button>
                    </List>
                </WingBlank>
            </div>
        );
    }
}

export default Rrgister;