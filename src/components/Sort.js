import React, { Component } from "react";
import "./../css/Menu.css";
import "./../css/Sort.css";

class Sort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: null,
      numbers: [],
      list: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }
  componentDidMount() {
    this.refs.ipnum.focus();
  }
  render() {
    return (
      <div className="sort">
        <div className="init">
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="ipnum"
              ref="ipnum"
              onChange={this.handleBlur}
            />
            <div className="list">{this.state.list}</div>
            <div className="actions">
              <input type="button" value="done" />
            </div>
          </form>
        </div>
      </div>
    );
  }

  handleBlur(e) {
    const number = Number(e.target.value);
    this.setState({ number });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.numbers.length <= 2) {
      let numbers = this.state.numbers;
      numbers.push(this.state.number);
      this.setState({ numbers });
      let list = this.state.numbers.map(num => (
        <div className="number">{num}</div>
      ));
      this.setState({ list });
      this.props.notify({
        id: Date.now(),
        type: "NOTIFY",
        msg: `Number added ${this.state.number}`
      });
      this.refs.ipnum.value = "";
    } else {
      this.props.notify({
        id: Date.now(),
        timeOut: 5000,
        type: "NOTIFY",
        msg: `We have enough numbers to start with the simulation. Lets start!! \n Press Done..`
      });
    }
  }
}

export default Sort;
