import React, { Component } from "react";
import Notification from "./Notification";
import { CSSTransitionGroup } from "react-transition-group";
import { nTypes } from "./../util/GlobalVars";
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
    return this.state.notifications.map((n, i) => {
      if (n.type === nTypes.GREET || n.type === nTypes.NOTIFY) {
        const id = n.id;
        // setTimeout(id => {
        //   let ind = this.state.notifications.find(note => note.id === id);
        //   let notes = this.state.notifications;
        //   notes.splice(ind, 1);
        //   this.setState({ noticiations: notes });
        // }, n.timeOut);

        this.setNotificationTimeOut(n)
          .then(id => {
            // console.log("after waiting : ");
            let ind = this.state.notifications.find(note => note.id === id);
            let notes = this.state.notifications;
            notes.splice(ind, 1);
            this.setState({ noticiations: notes });
          })
          .catch(err => {
            console.log("Error removing notification.\n", err);
          });
      }
      return <Notification key={n.id} data={n} />;
    });
  }

  setNotificationTimeOut(n) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
        return n.id;
      }, n.timeOut);
    });
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
