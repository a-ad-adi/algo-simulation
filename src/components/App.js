import React, { Component } from "react";
import Main from "./Main";
import Sidebar from "./Sidebar";
import Menubar from "./Menubar";
import Notification from "./Notification";
import { nTypes } from "./../util/GlobalVars";

import "./../css/App.css";

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
          id: Date.now(),
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
    if (n.type === nTypes.DESCRIBE) {
      const { id, type, stepInfo } = n;
      notifications.push({ id, type, stepInfo });
    } else if (n.type === nTypes.ERROR) {
      const { id, type, timeOut, err } = n;
      notifications.push({ id, type, timeOut, err });
    } else if (n.type === nTypes.NOTIFY) {
      const { id, timeOut = 2000, type, msg } = n;
      notifications.push({ id, timeOut, type, msg });
    }
    this.setState({ notifications });
  }

  changeComponent(component) {
    this.setState({ component });
  }
}
