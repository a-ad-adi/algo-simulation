import React, { Component } from "react";
import Main from "./Main";
import Sidebar from "./Sidebar";
import Menubar from "./Menubar";
import { nTypes } from "./../util/GlobalVars";
import "./../css/App.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

library.add(...[faTimes, faPlus, faMinus]);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: {
        type: "Select an algorithm",
        algo: ""
      },
      notifications: []
    };
    this.notify = this.notify.bind(this);
    this.clearNotifications = this.clearNotifications.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.changeComponent = this.changeComponent.bind(this);
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
      this.removeNotification({ id, type, timeOut });
    } else if (type === nTypes.CONTENT) {
      const { content, stepNo } = n;
      notifications.push({ id, type, content, stepNo });
    }
    this.setState({ notifications });
  }

  clearNotifications() {
    this.setState({ notifications: [] });    
  }

  removeNotification({ id, type, timeOut }) {
    setTimeout(() => {
      let ind = this.state.notifications.findIndex(
        (note, ind) => note.id === id
      );
      if (ind !== null) {
        let notes = this.state.notifications;
        notes.splice(ind, 1);
        this.setState({ noticiations: notes });
      }
    }, timeOut);
  }

  changeComponent(component) {
    this.setState({ component });
  }

  render() {
    return (
      <div className="App">
        <div className="title-home">Home</div>
        <div className="home">
          <Menubar changeComponent={this.changeComponent} clearNotifications={this.clearNotifications}/>
          <Main
            component={this.state.component}
            notify={this.notify}
            clearNotifications={this.clearNotifications}
          />
          <Sidebar
            notifications={this.state.notifications}
            removeNotification={this.removeNotification}
          />
        </div>
      </div>
    );
  }
}
