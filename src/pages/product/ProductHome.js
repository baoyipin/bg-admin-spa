import React from "react";
import {Table,Button,Input,Select,Icon,Card,message} from "antd";
import LinkButton from "../../components/linkButton/LinkButton";
import {reqProducts,reqSearchProd,reqUpdateStatus} from "../../api/index";
import {PAGE_SIZE} from "../../utils/constants";

const Option = Select.Option;
class ProductHome extends React.Component{
    constructor(){
        super();
        this.state={
            loading:false,
            total:0,
            searchName:"",
            searchType:"productName",
            products: []
        }
    }
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price  // 当前指定了对应的属性dataIndex, 传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    const {status, _id} = product
                    const newStatus = status===1 ? 2 : 1
                    return (
                        <span>
              <Button
                  type='primary'
                  onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status===1 ? '下架' : '上架'}
              </Button>
              <span>{status===1 ? '在售' : '已下架'}</span>
            </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            <LinkButton onClick={()=>{
                                this.props.history.push("/product/detail",product)
                            }}>详情</LinkButton>
                            <LinkButton onClick={()=>{
                                this.props.history.push("/product/addupdate",product)
                            }}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    };
    async getProductList(pageNum){
        this.pageNum = pageNum;//在改变商品上架/下架状态时可以用到
        const {searchType,searchName} = this.state;
        this.setState({loading:true});
        let result;
        if (searchName){//如果有searchName，进行搜索分页显示
            result = await reqSearchProd({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else {
            result = await reqProducts(pageNum,PAGE_SIZE);
        }

        this.setState({loading:false});
        if (result.status===0){
            const {total,list} = result.data;
            this.setState({total,products:list});
        }
    };
    async updateStatus(productId,status){
        const result = await reqUpdateStatus(productId,status);
        if (result.status===0){
            message.success("更新商品状态成功");
            this.getProductList(this.pageNum);
        }
    }
    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getProductList(1)
    }
    render(){
        const {products,total,searchName,searchType,loading} = this.state;
        const title=(
            <span>
                <Select
                    value={searchType}
                    style={{width:150}}
                    onChange={value=>{this.setState({searchType:value})}}
                >
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                    placeholder="关键字"
                    style={{width:150,margin:" 0 15px"}}
                    onChange={e=>{this.setState({searchName:e.target.value})}}
                />
                <Button type="primary" onClick={()=>{this.getProductList(1)}}>搜索</Button>
            </span>
        );
        const extra = (
            <Button type="primary" onClick={()=>{this.props.history.push("/product/addupdate")}}>
                <Icon type="plus"></Icon>
                添加
            </Button>
        );

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey="_id"
                    dataSource={products}
                    loading={loading}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize:PAGE_SIZE,
                        total,
                        onChange:(p)=>{this.getProductList(p)},
                        showQuickJumper:true
                    }}
                />;
            </Card>
        )
    }
}
export default ProductHome