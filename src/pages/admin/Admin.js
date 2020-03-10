import React from "react";
import memoryUtils from "../../utils/memoryUtils";
import {Redirect, Route, Switch} from "react-router-dom";
import { Layout } from 'antd';
import Nav from "../../components/nav/Nav";
import Header from "../../components/header/Header";

import Home from '../home/Home'
import Category from '../category/Category'
import Product from '../product/Product'
import Role from '../role/Role'
import User from '../user/User'
import Bar from '../charts/Bar'
import Line from '../charts/Line'
import Pie from '../charts/Pie'
import NotFound from '../not-found/Not-found'
import Order from '../order/Order'

const { Footer, Sider, Content } = Layout;
class Admin extends React.Component{
    constructor(){
        super()
    }
    render(){
        const data = memoryUtils.user;
        if (!data||!data._id){
            return <Redirect to="/login"></Redirect>
        }
        return (
            <Layout style={{height:"100%"}}>
                <Sider>
                    <Nav></Nav>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin:20,backgroundColor:"#fff"}}>
                        <Switch>
                            <Redirect from='/' exact to='/home'/>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/user' component={User}/>
                            <Route path='/role' component={Role}/>
                            <Route path="/charts/bar" component={Bar}/>
                            <Route path="/charts/pie" component={Pie}/>
                            <Route path="/charts/line" component={Line}/>
                            <Route path="/order" component={Order}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Content>
                    <Footer style={{color:"#bbb",textAlign:"center"}}>推荐使用Chrome浏览器</Footer>
                </Layout>
            </Layout>
        )
    }
}
export default Admin