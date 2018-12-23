import React, { Component } from "react";
import Menu from "./Menu";
import "./../css/Menubar.css";

class Menubar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: {
        "Sorting Algorithm": ["Merge sort"],
        "Shortest Path Algorithm": ["Dijkshtra's algorithm"]
      },
      title: "Menubar",
      menubarCls: "menus",
      subMenuCls: "sub-menus",
      minMax: MIN
    };
  }

  render() {
    return (
      <div className="menubar section-header">
        {this.state.title}
        <span className="min-btn" onClick={this.handleClick}>
          {this.state.minMax}
        </span>
        <div className={this.state.menubarCls}>{this.loadMenus()}</div>
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

  getClsList(str) {
    return str.split(/\s/);
  }

  removeClass(list, cls) {
    const ind = list.indexOf(cls);
    if (ind > -1) {
      return [...list.splice(0, ind), ...list.slice(ind + 1, list.length)];
    }
    return list;
  }

  addClass(list, cls) {
    if (list.indexOf(cls) === -1) {
      list.push(cls);
      return list;
    } else return list;
  }
}

export default Menubar;

const [MIN, MAX] = ["-", "+"];
