import React from "react";
import {Input,Tree,Form} from "antd";
import PropTypes from "prop-types";
import menuList from "../../config/menuConfig";

const Item = Form.Item;
const {TreeNode} = Tree;

class AuthForm extends React.Component{
    constructor(props){
        super(props);
        const {menus} = props.role;
        this.state={
            checkedKeys:menus
        }
    }
    static propTypes = {
        role:PropTypes.object
    };
    getMenus = ()=>this.state.checkedKeys;
    getTreeNodes(menuList){
        const nodes=menuList.map(item=>{
            return (
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
        });
        return nodes;
    }
    onCheck=(checkedKeys)=>{
        this.setState({checkedKeys})
    };
    componentWillMount(){
        this.treeNodes = this.getTreeNodes(menuList)
    }
    componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus;
        this.setState({
            checkedKeys:menus
        })
    }
    render(){
        const {role} = this.props;
        const {checkedKeys} = this.state;
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        };

        return (
            <div>
                <Item label="角色名称" {...formItemLayout}>
                    <Input value={role.name} disabled/>
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                   <TreeNode
                       title="角色权限"
                       key="all"
                   >
                       {this.treeNodes}
                   </TreeNode>
                </Tree>
            </div>
        )
    }
}
export default AuthForm