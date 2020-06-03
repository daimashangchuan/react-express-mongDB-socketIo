/**
 * 老板的主界面组件
 */

import React, { Component } from 'react';

import { connect } from "react-redux";
import { getUserList } from "../../redux/actions"
import UserList from "../../components/user-list/user-list"


import "./laoban.less";

class Laoban extends Component {

    componentDidMount() {
        // 更新 redux 的数据
        this.props.getUserList('dashen');
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
)(Laoban);

