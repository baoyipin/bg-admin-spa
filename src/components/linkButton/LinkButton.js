import React from "react";
import "./index.less";
function LinkButton(props) {
    return <button {...props} className="link-button">{props.children}</button>
}
export default LinkButton