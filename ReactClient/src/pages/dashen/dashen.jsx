/**
 * 大神的主界面组件
 */

import React, { Component } from 'react';

import { connect } from "react-redux";
import { getUserList } from "../../redux/actions"
import UserList from "../../components/user-list/user-list"

import "./dashen.less";

class Dashen extends Component {
    componentDidMount() {
        // 更新 redux 的数据
        this.props.getUserList('laoban');
    }

    render() {

        // 获取用户的类型
        const { userList } = this.props;

        return (
            <div>
                <UserList userList={ userList } />
            </div>
        );
    }
}

export default connect(
    state => ({ userList: state.userList }),
    { getUserList }
)(Dashen);

