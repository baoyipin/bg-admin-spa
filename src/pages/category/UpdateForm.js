import React from "react";
import {Form,Select,Input} from "antd";
import PropTypes from "prop-types";
const Item = Form.Item;

class UpdateForm extends React.Component{
    constructor(){
        super()
    }
    static propTypes = {
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    };
    componentWillMount(){
        const setForm = this.props.setForm;
        setForm(this.props.form)
    }
    render(){
        const {getFieldDecorator} = this.props.form;
         const categoryName = this.props.categoryName;
        return (
            <Form>
                <Item>
                    {getFieldDecorator("categoryName", {
                        initialValue: categoryName,
                        rules:[
                            {required:true,message:"必须输入"}
                        ]
                    })(
                        <Input placeholder="请输入分类名称"/>
                    )}
                </Item>

            </Form>
        )
    }
}
export default Form.create()(UpdateForm)