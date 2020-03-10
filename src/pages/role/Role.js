import React from "react";
import {Card,Button,Table,message,Modal} from "antd";
import {reqRoles,reqAddRole,reqUpdateRole} from "../../api/index";
import AddForm from "./AddForm";
import AuthForm from "./AuthForm";
import memoryUtils from "../../utils/memoryUtils";
import {formateDate} from "../../utils/dateUtils";
import storageUtils from "../../utils/storageUtils";
class Role extends React.Component{
    constructor(){
        super();
        this.state = {
            roles:[
                {
                    "menus": [
                        "/role",
                        "/charts/bar",
                        "/home",
                        "/category"
                    ],
                    "_id": "5ca9eaa1b49ef916541160d3",
                    "name": "测试",
                    "create_time": 1554639521749,
                    "__v": 0,
                    "auth_time": 1558679920395,
                    "auth_name": "test007"
                },
                {
                    "menus": [
                        "/role",
                        "/charts/bar",
                        "/home",
                        "/charts/line",
                        "/category",
                        "/product",
                        "/products"
                    ],
                    "_id": "5ca9eab0b49ef916541160d4",
                    "name": "经理",
                    "create_time": 1554639536419,
                    "__v": 0,
                    "auth_time": 1558506990798,
                    "auth_name": "test008"
                }
            ],
            role:{},
            isShowAdd:false,
            isShowUpdate:false
        }
        this.auth = React.createRef();
    }
    onRow=(role)=>{
        return {
            onClick:(e)=>{
                this.setState({role})
            }
        }
    }
    initColumns(){
        this.columns=[
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: (auth_time) => formateDate(auth_time)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }
    async getRoles(){
        const result = await reqRoles();
        if (result.status===0){
            const roles = result.data;
            this.setState({roles})
        }
    }
    setForm(form){
        this.form=form;
    }
    addRole(){
        //进行表单验证，验证成功才往下进行
        this.form.validateFields(async (error,values)=>{
            //收集数据
            if (!error){
                const {roleName} = values;
                this.form.resetFields();//清空输入框
                //发送请求
                const result = await reqAddRole(roleName);
                this.setState({isShowAdd:false});
                //如果请求成功更新显示
                if (result.status===0){
                    message.success("添加角色成功");
                    const role = result.data;
                    this.setState({roles:[...this.state.roles,role]})
                }else {
                    message.error("添加角色失败");
                }
            }
        })
    };
    async updateRole(){
        this.setState({isShowUpdate:false});
        const menus = this.auth.current.getMenus();
        const role = this.state.role;
        role.menus = menus;
        role.auth_name = memoryUtils.user.username;
        role.auth_time = Date.now();
        const result = await reqUpdateRole(role);
        if (result.status===0){

            //如果更新自己角色权限，则强制退出登录
            if (role._id===memoryUtils.user.role_id){
                message.success("当前角色权限更新了，请重新登录");
                memoryUtils.user={};
                storageUtils.removeUser();
                this.props.history.replace("/login");
            }else {
                message.success("更新角色成功");
                this.getRoles();
            }
        }else {
            message.error("更新角色失败");
        }
    }
    componentWillMount(){
        this.initColumns();
    }
    componentDidMount(){
        this.getRoles();
    }
    render(){
        const {roles,role,isShowAdd,isShowUpdate} = this.state;
        const title = (
            <span>
                <Button
                    type="primary"
                    onClick={()=>{
                        this.setState({isShowAdd:true})
                    }}
                >添加角色</Button>&nbsp;&nbsp;
                <Button
                    type="primary"
                    disabled={!role._id}
                    onClick={()=>{
                        this.setState({isShowUpdate:true})
                    }}
                >设置角色权限</Button>
            </span>
        );
        return (
            <Card title={title}>
                <Table
                    bordered
                    dataSource={roles}
                    rowKey="_id"
                    columns={this.columns}
                    pagination={{defaultPageSize:5}}
                    rowSelection={{
                        type:"radio",
                        selectedRowKeys:[role._id],
                        onSelect:(role)=>{
                            this.setState({role})
                        }
                    }}
                    onRow = {this.onRow}
                ></Table>
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={()=>{this.addRole()}}
                    onCancel={() => {
                        this.setState({isShowAdd: false})
                        //this.form.resetFields()
                    }}
                >
                    <AddForm setForm={(form)=>{this.form=form}}></AddForm>
                </Modal>
                <Modal
                    title="更新角色"
                    visible={isShowUpdate}
                    onOk={()=>{this.updateRole()}}
                    onCancel={() => {
                        this.setState({isShowUpdate: false})
                    }}
                >
                    <AuthForm role={role} ref={this.auth}></AuthForm>
                </Modal>
            </Card>
        )
    }
}
export default Role