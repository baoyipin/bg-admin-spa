import React from "react";
import {Switch,Route,Redirect} from "react-router-dom";
import ProductHome from "./ProductHome";
import ProductDetail from "./ProductDetail";
import ProductAddUpdate from "./ProductAddUpdate";
import "./product.less";

class Product extends React.Component{
    constructor(){
        super()
    }
    render(){
        return (
            <Switch>
                <Route exact path="/product" component={ProductHome}></Route>
                <Route path="/product/addupdate" component={ProductAddUpdate}></Route>
                <Route path="/product/detail" component={ProductDetail}></Route>
                <Redirect to="/product"></Redirect>
            </Switch>
        )
    }
}
export default Product