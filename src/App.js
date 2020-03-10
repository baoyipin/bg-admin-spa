import React from "react";
import {BrowserRouter as Router,Route,Switch} from "react-router-dom";
import Login from "./pages/login/Login";
import Admin from "./pages/admin/Admin";

class App extends React.Component{
    constructor(){
        super()
    }

    render(){
        return (
            <Router>
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/" component={Admin}></Route>
                </Switch>
            </Router>
        )
    }
}
export default App