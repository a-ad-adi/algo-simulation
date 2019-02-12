import React, { Component } from "react";
import Menu from "./Menu";
import "./../css/Menubar.css";
import clsUtil from "./../util/class_modifier";
import stateUtil from "./../util/state_modifier";

class Menubar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: {
        "Sorting Algorithm": ["Merge sort"],
        "Shortest Path Algorithm": ["Dijkshtra's algorithm"],
        "SVG test": ["RapahelJs", "BonsaiJs", "Gsap", "Gsap_swap"]
      },
      cls: {
        menubarCls: "menus"
      },
      data: {
        title: "Menubar",
        minMax: MIN
      }
    };
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <div className="menubar section-header">
        {this.state.data.title}
        <span className="min-btn" onClick={this.handleClick}>
          {this.state.data.minMax}
        </span>
        <div className={this.state.cls.menubarCls}>{this.loadMenus()}</div>
      </div>
    );
  }

  loadMenus() {
    return Object.keys(this.state.menus).map(menu => {
      return (
        <Menu
          type="main-menu"
          menu={menu}
          subMenus={this.state.menus[menu]}
          changeComponent={this.props.changeComponent}
        />
      );
    });
  }

  handleClick(e) {
    let cls = this.state.cls.menubarCls;
    if (e.target.textContent === MIN) {
      cls = clsUtil.getClsList(cls).addCls("menus-min").clsStr;
      let oldCls = this.state.cls;
      let oldData = this.state.data;
      this.setState({
        cls: stateUtil.updateSubState(oldCls, "menubarCls", cls),
        data: stateUtil.updateSubState(oldData, "minMax", MAX)
      });
    } else {
      cls = clsUtil.getClsList(cls).removeCls("menus-min").clsStr;
      let oldCls = this.state.cls;
      let oldData = this.state.data;
      this.setState({
        cls: stateUtil.updateSubState(oldCls, "menubarCls", cls),
        data: stateUtil.updateSubState(oldData, "minMax", MIN)
      });
    }
  }
}

export default Menubar;

const [MIN, MAX] = ["-", "+"];
