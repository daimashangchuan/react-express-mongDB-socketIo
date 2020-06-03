/**
 * 显示用户列表的 UI 组件
 */

import React, { Component } from 'react';
import { withRouter } from "react-router-dom"
import PropTypes from "prop-types";
import { Card, WingBlank, WhiteSpace } from "antd-mobile";
import QueueAnim from 'rc-queue-anim';

const Header = Card.Header;
const Body = Card.Body;
class UserList extends Component {

    static propTypes = {
        userList: PropTypes.array.isRequired
    }

    render() {

        const { userList } = this.props;

        return (
            <WingBlank>
                <QueueAnim type='left'>
                    {
                        userList.map(user => (
                            <div key={ user._id }>
                                <WhiteSpace />
                                <Card onClick={ () => this.props.history.push(`/chat/${ user._id }`) }>
                                    <Header thumbStyle={{ width: '50px',height: '50px' }} thumb={ require(`../header-selector/images/头像1.png`) } extra={ user.username }></Header>
                                    <Body>
                                        <div>职位：{ user.post }</div>
                                        <WhiteSpace></WhiteSpace>
                                        { user.company? <div>公司：{ user.company }</div>: null  }
                                        <WhiteSpace></WhiteSpace>
                                        { user.salary? <div>月薪：{ user.salary }</div>: null  }
                                        <WhiteSpace></WhiteSpace>
                                        <div>描述：{ user.info }</div>
                                        <WhiteSpace></WhiteSpace>
                                    </Body>
                                </Card>
                            </div>
                        ))
                    }
                </QueueAnim>
                
            </WingBlank>
        );
    }
}

export default withRouter(UserList);









