import React, { Component } from "react";
import Main from "./Main";
import Sidebar from "./Sidebar";
import Menubar from "./Menubar";

import "./../css/App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: {
        type: "Select an algorithm",
        algo: ""
      },
      notifications: [{id: Date.now(), timeOut: 2000, type: "GREET", msg: "Hi there..!!" }]
    };
    this.notify = this.notify.bind(this);
    this.changeComponent = this.changeComponent.bind(this);
  }

  render() {
    return (
      <div className="App">
        <div className="title-home">Home</div>
        <div className="home">
          <Menubar changeComponent={this.changeComponent}/>
          <Main
            component={this.state.component}                      
            notify={this.notify}
          />
          <Sidebar notifications={this.state.notifications} />
        </div>
      </div>
    );
  }

  notify(msg) {
    let notifications = this.state.notifications;    
    notifications.timeOut = this.state.notifications.timeOut || 2000;    
    notifications.push(msg);
    this.setState({notifications});
  }

  changeComponent(component){
    this.setState({component});
  }
}

export default App;
