import React from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from "react-router-dom";
import memoryUtils from "./utils/memoryUtils";
import storageUtils from "./utils/storageUtils";

import App from './App';
const user = storageUtils.getUser();
if (user&&user._id){
    //在刷新页面的时候，如果已经登陆，将本地存储的登陆信息存储到内存中
    //这样Admin组件就可以从内存中读到登陆信息，保持登陆状态，而不是跳转到登陆页面
    memoryUtils.user = user;
}

ReactDOM.render(<App />, document.getElementById('root'));
