import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { actions } from "../util/GlobalVars";

const [MIN, MAX] = ["minus", "plus"];
export default class MinimizeBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: MIN
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.state.icon === MIN) {
      this.minimize();
      this.setState({ icon: MAX });
    } else {
      this.maximize();
      this.setState({ icon: MIN });
    }
  }

  minimize() {
    const { scaleToZero, displayNone, sectionCode } = this.props;
    scaleToZero(sectionCode);
    setTimeout(() => {
      displayNone(sectionCode);      
    }, 80);
  }

  maximize() {
    const { scaleToNormal, displayVisible, sectionCode } = this.props;    
    scaleToNormal(sectionCode);
    setTimeout(() => {
      displayVisible(sectionCode);
    }, 80);

  }

  render() {
    return (
      <div className="minmax-btn" onClick={this.handleClick}>
        <FontAwesomeIcon icon={this.state.icon} className="icon" />
      </div>
    );
  }
}
