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
          <div className="n-header">Step {data.stepInfo.stepNo}</div>
          <div className="n-body">{this.loadDesc(data.stepInfo.desc)}</div>
        </div>
      );
    else if (data.type === nTypes.ERROR) {
      return (
        <div>
          <div className="n-header">{data.err.name}</div>
          <div className="n-body">{this.loadDesc(data.stepInfo.desc)}</div>
        </div>
      );
    } else if (data.type === nTypes.NOTIFY)
      return <p>{data.msg}</p>;    
  }
  
  loadDesc(desc) {
    return desc.map( (d, i) => <p key={i}>{d}</p>)
  }
  
  render() {
    return <div className={this.state.cls}>{this.getBody()}</div>;
  }
}
