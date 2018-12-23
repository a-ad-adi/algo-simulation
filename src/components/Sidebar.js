import React, { Component } from "react";
import "./../css/Sidebar.css";
import { CSSTransitionGroup } from 'react-transition-group'

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {notifications: props.notifications};
    this.displayNotifications = this.displayNotifications.bind(this);
  }
  render() {
    return (
      <div className="sidebar section-header">
        Sidebar
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

  displayNotifications() {
    return this.state.notifications.map((n, i) => {
      if (n.type === "GREET" || n.type === "NOTIFY") {
        const id = n.id;
        console.log("setting timeout..", id);
        setTimeout( (id) => {
          let ind = this.state.notifications.find( (note) => note.id === id);
          let notes = this.state.notifications;
          notes.splice(ind, 1);
          this.setState({noticiations: notes});
        }, n.timeOut);
      }
      return (
        <div
          key={n.id}
          className="note1"          
        >
          {n.msg}
        </div>
      );
    });
  }
}

export default Sidebar;
