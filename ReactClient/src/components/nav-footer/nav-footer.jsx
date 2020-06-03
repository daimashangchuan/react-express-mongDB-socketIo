/**
 * 公共底部组件
 */

import React, { Component } from 'react';
import PropTypes from "prop-types";
import { TabBar } from "antd-mobile";
import { withRouter } from "react-router-dom";

const Item = TabBar.Item;
class NavFooter extends Component {

    static propTypes = {
        navList: PropTypes.array.isRequired,
        unReadCount: PropTypes.number.isRequired,
    }

    render() {

        let { navList, unReadCount } = this.props;
        navList = navList.filter(nav => !nav.hide);
        const path = this.props.location.pathname; 
        
        return (
            <TabBar>
                { 
                    navList.map((nav) => (
                        <Item key={ nav.path } title={ nav.text } icon={{ uri: require('./images/personal.png') }} 
                            selected={ path === nav.path } badge={ nav.path ==='/message'? unReadCount: 0 }
                            selectedIcon={{ uri: require(`./images/personal-active.png`) }} 
                            onPress={ () => { this.props.history.replace(nav.path) } }/>
                    ))
                }
            </TabBar>
        );
    }
}

export default withRouter(NavFooter);



