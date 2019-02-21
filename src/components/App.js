import React, { Component } from "react";
import Main from "./Main";
import Sidebar from "./Sidebar";
import Menubar from "./Menubar";
import { nTypes } from "./../util/GlobalVars";
import uuid from "uuid";
import "./../css/App.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

library.add(faTimes);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: {
        type: "Select an algorithm",
        algo: ""
      },
      notifications: [
        {
          id: uuid(),
          timeOut: 2000,
          type: nTypes.NOTIFY,
          msg: "Hi there..!!"
        }
      ]
    };
    this.notify = this.notify.bind(this);
    this.changeComponent = this.changeComponent.bind(this);
  }

  render() {
    return (
      <div className="App">
        <div className="title-home">Home</div>
        <div className="home">
          <Menubar changeComponent={this.changeComponent} />
          <Main component={this.state.component} notify={this.notify} />
          <Sidebar notifications={this.state.notifications} />
        </div>
      </div>
    );
  }

  notify(n) {
    let notifications = this.state.notifications;
    const { id, type } = n;
    if (type === nTypes.DESCRIBE) {
      const { stepInfo } = n;
      notifications.push({ id, type, stepInfo });
    } else if (type === nTypes.ERROR) {
      const { timeOut = 2000, err } = n;
      notifications.push({ id, type, timeOut, err });
    } else if (type === nTypes.NOTIFY) {
      const { timeOut = 2000, msg } = n;
      notifications.push({ id, type, timeOut, msg });
    }
    this.setState({ notifications });
  }

  changeComponent(component) {
    this.setState({ component });
  }
}
