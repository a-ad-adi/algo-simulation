import React, { Component } from "react";
import Notification from "./Notification";
import { CSSTransitionGroup } from "react-transition-group";
import "./../css/Sidebar.css";

export default class Sidebar extends Component {
  containerEnd;

  constructor(props) {
    super(props);
    this.state = { notifications: props.notifications };
    this.displayNotifications = this.displayNotifications.bind(this);
  }

  componentDidUpdate() {
    this.scrollToNotification();
  }

  displayNotifications() {
    return this.state.notifications.map((n, i) => <Notification key={n.id} data={n} />);
  }

  scrollToNotification() {
    if (this.containerEnd) {
      this.containerEnd.scrollIntoView({ behavior: "smooth" });      
    }
  }

  render() {
    return (
      <div className="sidebar">
        <div className="section-header">Sidebar</div>
        <div className="sidebar-body">
          <CSSTransitionGroup
            transitionName="note"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {this.displayNotifications()}
            <div
              className="containerEnd"
              ref={ref => (this.containerEnd = ref)}
            />
          </CSSTransitionGroup>
        </div>
      </div>
    );
  }
}
