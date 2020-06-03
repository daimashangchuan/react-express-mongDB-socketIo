/**
 * 公共 logo 图片
 */

import React from "react";

import logo from "./images/logo.jpg";
import "./logo.less";

export default function() {
    return (
        <div className="logo-container"> 
            <img src={ logo } alt="logo" className="logo-img" />
        </div>
    )
}

