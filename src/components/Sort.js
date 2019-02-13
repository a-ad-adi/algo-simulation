import React, { Component } from "react";
import SortSimulation from './SortSimulation';
import "./../css/Menu.css";
import "./../css/Sort.css";

class Sort extends Component {
  simContainer;
  constructor(props) {
    super(props);
    this.state = {
      number: null,
      numbers: [],
      list: [],
      isReady: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.scrollToStep = this.scrollToStep.bind(this);
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
              <input type="button" value="done" onClick={this.handleClick} />
            </div>
          </form>
        </div>
        <hr/>
        <div className="simulation" ref={ref => this.simContainer = ref}>{this.simulate()}</div>
      </div>
    );
  }

  simulate() {
    if (this.state.isReady) {
      return <SortSimulation numbers={this.state.numbers} scrollToStep= {this.scrollToStep}/>;
    } else return null;
  }
  scrollToStep(){
    // this.simContainer.scrollIntoView({behavior: 'smooth'});
    this.simContainer.scrollTop = this.simContainer.scrollHeight;
    console.log("to bottom");
  }
  handleBlur(e) {
    const number = Number(e.target.value);
    this.setState({ number });
  }

  handleClick(e) {
    if (this.state.numbers.length) {
      this.setState({ isReady: true });
    } else {
      this.props.notify({
        id: Date.now(),
        timeOut: 5000,
        type: "NOTIFY",
        msg: NO_NUMBERS
      });
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.isValidInput()) {
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
    }
  }

  isValidInput() {
    const len = this.state.numbers.length;
    const number = this.state.number;
    if (!Number(number)) {
      this.props.notify({
        id: Date.now(),
        type: "NOTIFY",
        msg: INVALID_NO
      });
      return false;
    }
    if (len === 5) {
      this.props.notify({
        id: Date.now(),
        timeOut: 5000,
        type: "NOTIFY",
        msg: LIMIT_EXCEED
      });
      return false;
    }

    return true;
  }
}

export default Sort;

const [NO_NUMBERS, INVALID_NO, LIMIT_EXCEED] = [
  "Add some numbers to start with..",
  "Invalid input..Enter numbers only..",
  "We have enough numbers to start with the simulation. Lets start!! Press Done.."
];
