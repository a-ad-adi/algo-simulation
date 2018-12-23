import React, { Component } from "react";
import "./../css/Menu.css";
import clsUtil from "./../util/class_modifier";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      cls: {
        menuCls: props.type,
        subMenuCls: "sub-menus",
        minimizeBtnCls: "menu-collapse-expand"
      },
      data: {
        minMax: "-"
      }
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleMinimize = this.handleMinimize.bind(this);
    this.loadSubMenus = this.loadSubMenus.bind(this);
  }

  render() {
    let name = "";
    if (this.props.type === MAIN_MENU) name = this.props.menu;
    else name = this.props.subMenu;
    return (
      <div ref={this.props.type} className={this.props.type}>
        <div className="menu-title" onClick={this.handleClick}>
          {name}
          {this.loadButtons()}
        </div>
        {this.loadSubMenus()}
      </div>
    );
  }
  loadSubMenus() {
    if (this.props.type === MAIN_MENU) {
      const subMenus = this.props.subMenus.map(subMenu => {
        return (
          <Menu
            type={SUB_MENU}
            menu={this.props.menu}
            subMenu={subMenu}
            changeComponent={this.props.changeComponent}
          />
        );
      });
      return <div className={this.state.cls.subMenuCls}>{subMenus}</div>;
    }
  }
  loadButtons() {
    if (this.props.type === MAIN_MENU) {
      return (
        <div
          ref="colexp"
          id={this.props.menu.replace(/\s+/, "-")}
          className={this.state.cls.minimizeBtnCls}
          onClick={this.handleMinimize}
        >
          {this.state.data.minMax}
        </div>
      );
    } else return null;
  }
  handleMinimize(e) {
    let [cls, data, newCls] = [null, null, ""];
    if (this.state.data.minMax === MIN) {
      newCls = clsUtil.getClsList(this.state.cls.subMenuCls).addCls(COLLAPSE)
        .clsStr;
      cls = updateSubState(this.state.cls, "subMenuCls", newCls);
      data = updateSubState(this.state.data, "minMax", MAX);
    } else {
      newCls = clsUtil.getClsList(this.state.cls.subMenuCls).removeCls(COLLAPSE)
        .clsStr;
      cls = updateSubState(this.state.cls, "subMenuCls", newCls);
      data = updateSubState(this.state.data, "minMax", MIN);
    }
    this.setState({ cls, data });
  }

  handleClick(e) {
    this.props.changeComponent({
      type: this.props.menu,
      algo: this.props.subMenu
    });
  }
}

function updateSubState(prop, key, val) {
  prop[key] = val;
  return prop;
}

export default Menu;

const [MAIN_MENU, SUB_MENU, COLLAPSE, MIN, MAX] = [
  "main-menu",
  "sub-menu",
  "sub-menu-collapse",
  "-",
  "+"
];
