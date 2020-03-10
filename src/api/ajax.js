/*
* 发送ajax异步请求
* 优化：
* 1 统一处理异步请求错误
*    返回一个Promise实例，如果成功，返回response，这样前端就能拿到结果
*    但是如果不成功，直接在这里统一catch处理，前端就不用再分别处理了，少写很多try catch
* 2 请求成功后直接返回data，res（response.data）
* */

import  axios from "axios";
import {message} from "antd"
export default function ajax(url,data={},method="GET"){

    return new Promise((res,rej)=>{
        let promise;
        if (method==="GET"){
           promise = axios.get(url,{params:data})
        }else {
           promise = axios.post(url,data)
        }
        promise.then(response=>{
            res(response.data)
        }).catch(error=>{
            message.error("error:"+error.message);
        })
    });

}