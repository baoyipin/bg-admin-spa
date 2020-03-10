import React from "react";
import "./index.less";
import logo from "./images/logo.png";
import {Link,withRouter} from "react-router-dom";
import { Menu, Icon, Button } from 'antd';
import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
const { SubMenu } = Menu;

class Nav extends React.Component{
    constructor(){
        super()
    }
    componentWillMount(){
        this.menuList = this.getMenuList(menuList);
    }
    hasAuth = (item)=>{
        const {key,isPublic} = item;
        const user = memoryUtils.user;
        const {username,role} = user;
        const {menus} = role;
        if (username==="admin" || isPublic || menus.indexOf(key)!==-1){
            return true
        }else if (item.children){
            return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
        }
        return false
    };
    getMenuList=menuList=>{
        return menuList.map(item=>{
            const {title,key,icon,children} = item;
            if (this.hasAuth(item)){
                if (!children){
                    return (
                        <Menu.Item key={key}>
                            <Link to={key}>
                                <Icon type={icon} />
                                <span>{title}</span>
                            </Link>
                        </Menu.Item>
                    )
                }else {
                    const cItem = children.find(i=>this.props.location.pathname.indexOf(i.key)===0);
                    if (cItem){
                        this.openKey = item.key;
                    }
                    return (
                        <SubMenu
                            key={key}
                            title={
                                <span>
                                <Icon type={icon}/>
                                <span>商品</span>
                            </span>
                            }>
                            {this.getMenuList(children)}
                        </SubMenu>
                    )
                }
            }
        })
    };
    render(){
        let path=this.props.location.pathname;
        if (path.indexOf("/product")===0){
            path = "/product"
        }
        return (
            <div className="left-nav">
                <Link  to="/" className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <p>我的后台</p>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[this.openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {this.menuList}
                </Menu>
            </div>
        )
    }
}
export default withRouter(Nav)