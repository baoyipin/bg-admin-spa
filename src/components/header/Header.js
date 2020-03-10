import React from "react";
import "./index.less";
import {requestWeather} from "../../api/index";
import {formateDate} from "../../utils/dateUtils";
import memoryUtils from "../../utils/memoryUtils";
import {withRouter} from "react-router-dom";
import menuList from "../../config/menuConfig";
import {Modal} from "antd";
import storageUtiles from "../../utils/storageUtils";
import LinkButton from "../../components/linkButton/LinkButton";

class Header extends React.Component{
    constructor(){
        super();
        this.state = {
            username:memoryUtils.user.username,
            dayPictureUrl:"",
            weather:"",
            currentTime:formateDate(Date.now())
        }
    }
    getTitle = () => {
        let title;
        const path = this.props.location.pathname;
        menuList.forEach(item=>{
            if (item.key===path){
                title = item.title;
            }else if(item.children){
                const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0);
                if (cItem){
                    title = cItem.title;
                }
            }
        });
        return title;
    };
    getCurrentTime = ()=>{
        this.timer = setInterval( ()=> {
            this.setState({currentTime:formateDate(Date.now())});
        },1000);
    };
    getWeather = async ()=>{
        const {dayPictureUrl,weather} = await requestWeather("北京");
        this.setState({dayPictureUrl,weather})
    };
    logout = ()=>{
        Modal.confirm({
            content:"确定要退出吗？？？",
            onOk:()=>{
                memoryUtils.user = {};
                storageUtiles.removeUser();
                this.props.history.replace("/login");
            }
        });

    };
    componentDidMount(){
        this.getCurrentTime();
        this.getWeather();
    }
    componentWillUnmount(){
        clearInterval(this.timer);
    }
    render(){
        const {username,currentTime,dayPictureUrl,weather} = this.state;
        const title = this.getTitle();
        return (
            <div className="header">
                <div className="header-top">
                    <span>你好，{username}！</span>
                    <LinkButton  onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <span className="header-bottom-left">{title}</span>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)