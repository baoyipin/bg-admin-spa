import React from "react";
import "./index.less"
class Home extends React.Component{
    constructor(){
        super()
    }
    render(){
        return (
            <div className="home">
                欢迎使用后台管理系统！
            </div>
        )
    }
}
export default Home