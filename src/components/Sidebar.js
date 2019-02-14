import React, { Component } from "react";
import Notification from "./Notification";
import { CSSTransitionGroup } from "react-transition-group";
import { nTypes } from "./../util/GlobalVars";
import "./../css/Sidebar.css";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { notifications: props.notifications };
    this.displayNotifications = this.displayNotifications.bind(this);
  }

  displayNotifications() {
    return this.state.notifications.map((n, i) => {
      if (n.type === nTypes.GREET || n.type === nTypes.NOTIFY) {
        const id = n.id;
        setTimeout(id => {
          let ind = this.state.notifications.find(note => note.id === id);
          let notes = this.state.notifications;
          notes.splice(ind, 1);
          this.setState({ noticiations: notes });
        }, n.timeOut);
      }
      // return (
      //   <div
      //     key={n.id}
      //     className="note1"
      //   >
      //     {n.msg}
      //   </div>
      // );

      return (
        <Notification key={n.id} data={n} />
      );
    });
  }

  render() {
    return (
      <div className="sidebar">
        <div className="section-header">Sidebar</div>
        <CSSTransitionGroup
          transitionName="note"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {this.displayNotifications()}
        </CSSTransitionGroup>
      </div>
    );
  }
}
