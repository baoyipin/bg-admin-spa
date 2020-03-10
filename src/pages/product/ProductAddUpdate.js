import React from "react";
import {
    Card,
    Icon,
    Form,
    Input,
    Cascader,
    Button,
    message
} from 'antd'
import LinkButton from "../../components/linkButton/LinkButton";
import {reqCategorys,reqAddUpdateProduct} from "../../api/index";
import PicturesWall from "./PictureWall";
import RichTextEditor from "./RichTextEditor";


const {Item} = Form;
const { TextArea } = Input;

class ProductAddUpdate extends React.Component{
    constructor(){
        super();
        this.state={
            options:[]
        };
        this.pw = React.createRef();
        this.editor = React.createRef();
    }

    submit(){
        this.props.form.validateFields(async (error,values)=>{
            if (!error){
                message.success("提交表单");
                const {name,desc,price,categoryIds} = values;
                let categoryId,pCategoryId;
                if (categoryIds.length===1){
                    pCategoryId="0";
                    categoryId = categoryIds[0]
                }else {
                    pCategoryId = categoryIds[0];
                    categoryId = categoryIds[1];
                }
                const imgs = this.pw.current.getImgs();
                const detail = this.editor.current.getDetail();
                let product = {name,desc,price,categoryId,pCategoryId,imgs,detail};
                if (this.isUpdate){
                    product._id = this.product._id;
                }
                const result = await reqAddUpdateProduct(product);
                if (result.status===0){
                    message.success(`${product._id?"更新":"修改"}商品成功！`);
                    this.props.history.goBack();
                }else {
                    message.error(`${product._id?"更新":"修改"}商品失败！`)
                }
            }
        })
    }
    validatePrice(rule,value,callback){
        if (value*1>0){
            callback()
        }else {
            callback("价格必须大于1")
        }
    }
    //级联列表请求数据
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;
        //获取二级列表
        const parentId = targetOption.value;
        const result = await reqCategorys(parentId);
        targetOption.loading = false;
        if (result.status===0){
            targetOption.children = result.data.map(i=>({
                label: i.name,
                value: i._id,
                isLeaf:true
            }));
            this.setState({
                options: [...this.state.options],
            });
        }
    };
    //异步获取一级列表数据
    async getCategorys(){
        const result = await reqCategorys("0");
        if (result.status===0){
            const categories = result.data;
            const options = categories.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: false,
            }));
            this.setState({options})
        }
    }
    componentWillMount(){
        //取出从点击修改跳转时传过来的那一项商品信息，以便显示到修改页面上
        const product = this.props.location.state;
        this.isUpdate = !!product;//判断是从添加还是修改按钮跳转过来的
        this.product = product||{};
    }
    componentDidMount(){
        this.getCategorys()
    }

    render(){
        let {product,isUpdate} = this;
        const {pCategoryId,categoryId,imgs,detail} = product;
        const categoryIds = [];
        if (isUpdate){
            if (pCategoryId==="0"){
                categoryIds.push(categoryId)
            }else {
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId)
            }
        }

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 },  // 左侧label的宽度
            wrapperCol: { span: 8 }, // 右侧包裹的宽度
        };
        // 头部左侧标题
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                  <Icon type='arrow-left' style={{fontSize: 20}}/>
                </LinkButton>
                <span>{isUpdate?"修改商品":"添加商品"}</span>
            </span>
        );

        const {getFieldDecorator} = this.props.form;

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    {required: true, message: '必须输入商品名称'}
                                ]
                            })(<Input placeholder='请输入商品名称'/>)
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                            getFieldDecorator('desc', {
                                initialValue:product.desc,
                                rules: [
                                    {required: true, message: '必须输入商品描述'}
                                ]
                            })(<TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />)
                        }

                    </Item>
                    <Item label="商品价格">

                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    {required: true, message: '必须输入商品价格'},
                                    {validator: this.validatePrice}
                                ]
                            })(<Input type='number' placeholder='请输入商品价格' addonAfter='元'/>)
                        }
                    </Item>
                    <Item label="商品分类">
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    {required: true, message: '必须指定商品分类'},
                                ]
                            })(
                                <Cascader
                                    placeholder='请指定商品分类'
                                    options={this.state.options}  /*需要显示的列表数据数组*/
                                    loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                                />
                            )
                        }

                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={()=>{this.submit()}}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)