/*
* 定义接口函数，每一个接口对应一个函数
* 调用时只需要填写相应参数即可，不用重复写url和method
* */
import jsonp from "jsonp";
import {message} from "antd";
import ajax from "./ajax"
const BASE = "";

//登陆
export const reqLogin=(username,password)=>ajax("/login",{username,password},"POST");


// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId});

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId});

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST');

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST');

//请求商品列表
export const reqProducts = (pageNum,pageSize)=>ajax(BASE + "/manage/product/list",{pageNum,pageSize});

//按照商品名称/描述搜索
export const reqSearchProd = ({pageNum,pageSize,searchName,searchType})=>{
    return ajax(BASE + "/manage/product/search",{
        pageNum,
        pageSize,
        [searchType]:searchName
    });
};

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST');

//删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete',{name},"POST");

//添加/更新商品
export const reqAddUpdateProduct = (product) => ajax(BASE + '/manage/product/'+(product._id?"update":"add"),product,"POST");

//获取角色列表
export const reqRoles = ()=>ajax(BASE+"/manage/role/list");

//添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST');

//更新角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST');

//获取用户列表
export  const reqUsers = ()=>ajax(BASE+ '/manage/user/list');

//删除某一用户
export  const reqDeleteUser = (userId)=>ajax(BASE+ '/manage/user/delete',{userId},"POST");

//添加/更新用户
export  const reqAddOrUpdateUser = (user)=>ajax(BASE+'/manage/user/'+(user._id?"update":"add"),user,"POST");



//获取天气信息
export const requestWeather = (city)=>{
  return new Promise((resolve,reject)=>{
      const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
      jsonp(url,{},(error,data)=>{
          if (!error&data.status==="success"){//请求成功
              const {dayPictureUrl, weather} = data.results[0].weather_data[0];
              resolve({dayPictureUrl, weather});
          }else {//请求失败
              message.error("请求天气信息失败")
          }
      })
  })
};
