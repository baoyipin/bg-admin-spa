import React from "react";
import "./index.less";
import {Card,Table,Button,Icon,message,Modal} from "antd";
import LinkButton from "../../components/linkButton/LinkButton";
import {reqCategorys,reqUpdateCategory,reqAddCategory} from "../../api/index";
import AddForm from "./AddForm";
import UpdateForm from "./UpdateForm";

class Category extends React.Component{
    constructor(){
        super();
        this.state={
            categories:[],//一级分类列表
            subCategories:[],//二级分类列表
            loading:false,
            parentId:"0",//当前需要显示的分类列表的父分类id
            parentName:"",//当前显示列表的父分类，默认一级列表，没有父分类
            showStatus:0//是否显示模态框
        }
    }
    getColumns = ()=>{
        this.columns =  [
            {
                title: '分类的名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                width:300,
                render:(category)=>(
                    <span>
                        <LinkButton onClick={()=>{
                            this.category = category;//点击更新时保存所点击的分类信息，在弹出的模态框里显示
                            this.setState({showStatus:2})
                        }}>更新分类</LinkButton>
                        {this.state.parentId==="0"?<LinkButton onClick={()=>{
                            this.showSubCategories(category)
                        }}>查看子分类</LinkButton>:null}
                    </span>
                )
            }
        ];
    };
    //显示一级列表对应的二级列表
    showSubCategories(category){
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{
            this.getCategories();//获取二级分类列表
        })
    }

    //显示一级列表
    showCategories(){
        this.setState({
            parentName:"",
            parentId:"0",
            subCategories:[]
        })
    }

    //异步获取分类列表信息（根据parentId判断是一级还是二级）
    getCategories =async (parentId)=>{
        parentId = parentId||this.state.parentId;
        this.setState({loading:true});
        const result = await reqCategorys(parentId);
        this.setState({loading:false});
        if (result.status===0){
            const categories = result.data;
            if (parentId==="0"){
                this.setState({categories});
            }else {
                this.setState({subCategories:categories})
            }

        }else {
            message.error("请求商品列表出错")
        }

    };

    //显示添加分类模态框
    updateCategory(){
        this.form.validateFields( async (err,values)=>{
            if (!err){
                //1关闭模态框
                this.setState({showStatus:0});
                //2发送请求
                const categoryId = this.category._id;
                const {categoryName} = values;

                this.form.resetFields();//重置内存里的表单值
                const result = await reqUpdateCategory({categoryId,categoryName});
                if (result.status===0){
                    //3更新列表显示
                    this.getCategories();
                }
            }
        })

    };

    //显示更新分类模态框
    addCategory(){
        this.form.validateFields(async (err,values)=>{
            if (!err){
                //关闭模态框
                this.setState({showStatus:0});
                //收集数据发送请求
                const  {categoryName,parentId} = values;
                //删除输入内容
                this.form.resetFields();
                const result =  await reqAddCategory(categoryName,parentId);
                //获取更新后的列表更新显示
                if (result.status===0){
                    if (parentId===this.state.parentId){
                        this.getCategories();
                    }else if(parentId==="0"){
                        this.getCategories("0")
                    }

                }
            }
        })
    };

    //关闭模态框
    handleCancel=()=>{
        this.form.resetFields();
        this.setState({showStatus:0});
    };
    componentWillMount(){
        this.getColumns();
    }
    componentDidMount(){
        this.getCategories()
    }
    render(){
        const {loading,parentId,parentName,subCategories,showStatus} = this.state;
        subCategories.forEach(i=>{i.key=i._id});
        const category = this.category;
        const title = parentId==="0"?"一级分类列表":(
            <span>
                <LinkButton onClick={()=>{this.showCategories()}}>一级分类列表</LinkButton>
                <Icon type="arrow-right" style={{marginRight:5}}></Icon>
                <span>{parentName}</span>
            </span>
        );
        const extra = (
            <Button type="primary" onClick={()=>{this.setState({showStatus:1})}}>
                <Icon type="plus"></Icon>
                添加
            </Button>
        );
        /*const dataSource = [
            {
                "parentId": "0",
                "key": "0",
                "_id": "5c2ed631f352726338607046",
                "name": "分类001",
                "__v": 0
            },
            {
                "parentId": "0",
                "key": "1",
                "_id": "5c2ed647f352726338607047",
                "name": "分类2",
                "__v": 0
            },
            {
                "parentId": "0",
                "key": "2",
                "_id": "5c2ed64cf352726338607048",
                "name": "1分类3",
                "__v": 0
            }
        ];*/
        const columns = this.columns;
        const dataSource = this.state.categories;
        dataSource.forEach(i=>{i.key = i._id});
        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        dataSource={parentId==="0"?dataSource:subCategories}
                        columns={columns}
                        pagination={{defaultPageSize:5}}
                        loading={loading}
                    ></Table>
                </Card>
                <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk={()=>{this.addCategory()}}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        setForm={(form)=>{this.form = form}}
                        parentId={parentId}
                        categories={dataSource}
                    ></AddForm>
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus===2}
                    onOk={()=>{this.updateCategory()}}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category&&category.name}
                        setForm={(form)=>{this.form = form}}
                    ></UpdateForm>
                </Modal>
            </div>
        )
    }
}
export default Category