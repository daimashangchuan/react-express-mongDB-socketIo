/**
 *  选择头像的公共组件
 */
import React, { Component } from 'react';
import { List, Grid } from "antd-mobile"
import PropTypes from "prop-types"

import "./index.less"

class HeaderSelector extends Component {

    static propTypes = {
        setHeader: PropTypes.func.isRequired
    }

    state = {
        text: null, // 图片名称
        icon: null, // 图片对象
    }

    constructor(props) {
        super(props);
        // 准备需要显示的列表数据
        this.headerList = [];
        for(let i = 0; i < 20; i++ ){
            this.headerList.push({
                text: '头像' + (i+1),
                icon: require(`./images/头像${i+1}.png`)
            })
        }
    }   
    
    handleClick = (el) => {
        const { text, icon } = el
        // 跟新当前的组件
        this.setState({ icon, text })
        const data = text + '.' + icon.split('.')[icon.split('.').length -1]
        // 传递给父组件
        this.props.setHeader(data)
    }

    render() {

        const { icon, text } = this.state;

        // 头部见面
        const listHeader = !icon? '请选择头像' :(
            <div className='header-title'>
                已选择{ text }： <img className='header-image' src={ icon } alt=""/>
            </div>
        );
        return (
           <List renderHeader={() => listHeader}>
               <Grid onClick={ this.handleClick } data={this.headerList} columnNum={5}></Grid>
           </List>
        );
    }
}

export default HeaderSelector;