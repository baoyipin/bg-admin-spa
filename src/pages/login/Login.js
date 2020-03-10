import React from "react";
import "./login.less";
import logo from "./images/logo.png";
import { Form, Icon, Input, Button,message } from 'antd';
import {reqLogin} from "../../api/index";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Redirect} from "react-router-dom"
class Login extends React.Component{
    constructor(){
        super()
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {username,password} = values;
                const result = await reqLogin(username,password);
                if (result.status===0){
                    message.success("登陆成功");
                    //跳转到管理页面，replace替换当前路径，在不需要回退的时候使用
                    const user = result.data;
                    memoryUtils.user = user;
                    storageUtils.saveUser(user);
                    this.props.history.replace("/");
                }else {
                    message.error("登陆失败:"+result.msg)
                }

            }else {
                console.log("验证失败")
            }
        });
    };
    render(){
        const form = this.props.form;
        const {getFieldDecorator } = form;
        const user = memoryUtils.user;
        if (user&&user._id){//如果有登陆信息，自动登陆跳转到管理页面
            return <Redirect to="/"></Redirect>
        }
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt=""/>
                    <h1>我的后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator("username",{//声明式验证
                                rules: [
                                    { required: true, message: 'Please input your username!' },
                                    {min:4,message:"用户名必须大于4位"},
                                    {max:12,message:"用户名必须小于12位"},
                                    {pattern:/^[a-zA-Z0-9-]+$/,message:"必须是数字字母下划线"}
                                    ],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator("password",{//自定义验证
                                rules: [
                                    {validator:(rule,value,callback)=>{
                                        if(!value){
                                            callback("密码必须输入")
                                        }else if (value.length<4){
                                            callback("密码必须大于4位")
                                        }else if (value.length>12){
                                            callback("密码必须小于12位")
                                        }else if (!/^[a-zA-Z0-9-]+$/.test(value)){
                                            callback("密码必须是数字字幕下划线")
                                        }else {callback()}
                                    }}
                                    ],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登陆
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

const WrapLogin = Form.create()(Login);
export default WrapLogin