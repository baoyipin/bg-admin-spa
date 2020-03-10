import React from "react";
import {Form,Select,Input} from "antd";
import PropTypes from "prop-types";
const Item = Form.Item;
const Option = Select.Option;
class AddForm extends React.Component{
    constructor(){
        super()
    }
    static propTypes = {
        categories:PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    };
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        const {categories,parentId} = this.props;
        return (
            <Form>
                <Item>
                    {getFieldDecorator("parentId", {
                        initialValue: parentId
                    })(
                        <Select>
                            <Option value="0">一级分类</Option>
                            {categories.map(c=><Option key={c._id} value={c._id}>{c.name}</Option>)}
                        </Select>
                    )}
                </Item>
                <Item>
                    {getFieldDecorator("categoryName", {
                        initialValue: "",
                        rules:[
                            {required:true,message:"分类名称必须输入"}
                        ]
                    })(
                        <Input placeholder="请输入分类名称"/>
                    )}
                </Item>

            </Form>
        )
    }
}
export default Form.create()(AddForm)