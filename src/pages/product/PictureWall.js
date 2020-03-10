import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd'
import {reqDeleteImg} from "../../api/index";

import {BASE_IMG_URL} from "../../utils/constants";
/*
用于图片上传的组件
 */
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs: PropTypes.array
    };
    constructor (props) {
        super(props);
        let fileList=[];
        const imgs = this.props.imgs;
        if (imgs&&imgs.length>0){
            fileList = imgs.map((img,index)=>{
                return ({
                    uid: -index, // 每个file都有自己唯一的id
                    name: img, // 图片文件名
                    status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
                    url:BASE_IMG_URL+img
                })
            });
        }

        // 初始化状态
        this.state = {
            previewVisible: false, // 标识是否显示大图预览Modal
            previewImage: '', // 大图的url
            fileList/*: [
                {
                    uid: '-1', // 每个file都有自己唯一的id
                    name: 'xxx.png', // 图片文件名
                    status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
                    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
                },
            ],*/
        };
    }

    /*
    获取所有已上传图片文件名的数组
     */
    getImgs(){
        return this.state.fileList.map(i=>i.name);
    }
    /*
    隐藏Modal
     */




    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    /*
    file: 当前操作的图片文件(上传/删除)
    fileList: 所有已上传图片文件对象的数组
     */
    handleChange = async ({file, fileList }) => {
        if (file.status==="done"){
            const result = file.response;
            if (result.status === 0){
                message.success("上传图片成功");
                const {name,url} = result.data;
                const f = fileList[fileList.length-1];
                f.name=name;
                f.url=url;
            }else {
                message.error("上传图片失败")
            }
        }else if (file.status==="removed"){
            const result = await reqDeleteImg(file.name);
            if (result.status===0){
                message.success("删除图片成功");
            }else {
                message.error("删除图片失败")
            }
        }
        // 在操作(上传/删除)过程中更新fileList状态
        this.setState({ fileList })
    };
    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"
                    accept="image/*"//只可以接收任何格式的图片
                    name="image"//发送给后台的数据名称
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}