/**
 * 大神信息完善组件
 */

import React, { Component } from 'react';
import { Redirect } from "react-router-dom"

import { connect } from "react-redux";
import { getUserInfo } from "../../redux/actions";

import { NavBar, InputItem, TextareaItem, Button, Toast } from "antd-mobile";
import HeaderSelector from "../../components/header-selector";
import { reqUpdata } from "../../api";
import Cookies from "js-cookie";

import './dashen-info.less';

class DashenInfo extends Component {

    state = {
        header: "", // 头像名称
        post: "", // 职位
        info: "", // 个人或职位简介
        company: "", // 公司名称
        salary: "", // 月薪
    }

    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }

    setHeader = (header) => {
        this.setState({
            header
        })
    }

    conserveData = async () => {
        const { header, post, info } = this.state;
        if(!header || !post || !info) {
            Toast.offline("请完善所有的信息!!!");
            return;
        }
        const { code , msg } = await reqUpdata(this.state);
        if(code === 0) {
            Toast.success(msg, 1);
            this.props.history.replace("/dashen");
            this.props.getUserInfo();
        } else {
            Toast.fail(msg, 1);
        }
    }

    render() {

        // 如果 redirectTo 存在，重定向页面
        const socketioToken = Cookies.get('SOCKETIO_TOKEN');
        if(!socketioToken) {
            return <Redirect to='/login' />
        }

        return (
            <div>
                <NavBar>大神信息完善</NavBar>
                <HeaderSelector setHeader={ this.setHeader  } />
                <InputItem onChange={ val => { this.handleChange("post", val) } } placeholder="请输入求职岗位">求职岗位: </InputItem>
                <TextareaItem onChange={ val => { this.handleChange("info", val) } } title='个人介绍: ' placeholder="请输入个人介绍" rows={3}></TextareaItem>
                <Button type='primary' onClick={ () => { this.conserveData() } }>保 &nbsp;&nbsp; 存</Button>
            </div>
        );
    }
}

export default connect(
    state => ({ userInfo: state.userInfo }),
    { getUserInfo }
)(DashenInfo);

