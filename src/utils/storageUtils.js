/*
* 将登陆信息进行本地存储
* */
import  store from "store";
const USER_KEY = "user_key";
export default {
    saveUser:(user)=>{
        store.set(USER_KEY,user);
    },
    getUser:()=>{
        return store.get(USER_KEY)||{};
    },
    removeUser:(user)=>{
        store.remove(USER_KEY);
    }
}