/**
 * 老板信息完善组件
 */

import React, { Component } from 'react';
import { Redirect } from "react-router-dom"

import { connect } from "react-redux";
import { getUserInfo } from "../../redux/actions";

import { NavBar, InputItem, TextareaItem, Button, Toast } from "antd-mobile";
import HeaderSelector from "../../components/header-selector";
import { reqUpdata } from "../../api";

import Cookies from "js-cookie";
import './loaban-info.less';

class LaobanInfo extends Component {

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
        const { header, post, info, company, salary  } = this.state;
        if(!header || !post || !info || !company || !salary) {
            Toast.offline("请完善所有的信息!!!");
            return;
        }
        const { code , msg } = await reqUpdata(this.state);
        if(code === 0) {
            Toast.success(msg, 1);
            this.props.history.replace("/laoban");
            this.props.getUserInfo();
        } else {
            Toast.fail(msg, 1);
        }
    }

    render() {

        const socketioToken = Cookies.get('SOCKETIO_TOKEN');
        if(!socketioToken) {
            return <Redirect to='/login' />
        }

        return (
            <div>
                <NavBar>老板信息完善</NavBar>
                <HeaderSelector setHeader={ this.setHeader  } />
                <InputItem onChange={ val => { this.handleChange("post", val) } } placeholder="请输入招聘职位">招聘职位: </InputItem>
                <InputItem onChange={ val => { this.handleChange("company", val) } } placeholder="请输入公司名称">公司名称: </InputItem>
                <InputItem onChange={ val => { this.handleChange("salary", val) } } placeholder="请输入职位薪资">职位薪资: </InputItem>
                <TextareaItem onChange={ val => { this.handleChange("info", val) } } title='职位要求: ' placeholder="请输入职位要求" rows={3}></TextareaItem>
                <Button type='primary' onClick={ () => this.conserveData() }>保 &nbsp;&nbsp; 存</Button>
            </div>
        );
    }
}

export default connect(
    state => ({ userInfo: state.userInfo }),
    { getUserInfo }
)(LaobanInfo);