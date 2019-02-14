import React, { Component } from "react";
import "./../css/Notification.css";
import { nTypes } from "./../util/GlobalVars";
import clsUtil from "./../util/class_modifier";

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cls: "Notification"
    };
  }
  componentDidMount() {
    if (this.props.data.type === nTypes.ERROR) {
      const newCls = clsUtil.getClsList(this.state.cls).addCls("err").clsStr;
      this.setState({ cls: newCls });
    }
  }
  getBody() {
    const data = this.props.data;

    if (data.type === nTypes.DESCRIBE)
      return (
        <div>
          <div className="n-header">{data.stepInfo.id}</div>
          <p className="n-body">{data.stepInfo.desc}</p>
        </div>
      );
    else if (data.type === nTypes.ERROR) {
      return (
        <div>
          <div className="n-header">{data.err.name}</div>
          <p className="n-body">{data.err.desc}</p>
        </div>
      );
    } else if (data.type === nTypes.NOTIFY)
      return <p>{data.msg}</p>;    
  }

  render() {
    return <div className={this.state.cls}>{this.getBody()}</div>;
  }
}
