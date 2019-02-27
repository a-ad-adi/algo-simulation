import React, { Component } from "react";
import SortSimulation from "./SortSimulationContainer";
import MinimizeBtn from "../../MinimizeBtn";
import { nTypes, sortAlgo } from "../../../util/GlobalVars";
import uuid from "uuid/v1";
import "../../../css/Menu.css";
import "../../../css/SortInput.css";
import clsUtil from "../../../util/class_modifier";

//validation notifications
const [NO_NUMBERS, INVALID_NO, LIMIT_EXCEED] = [
  "Add some numbers to start with..",
  "Invalid input..Enter numbers only..",
  "We have enough numbers to start with the simulation. Lets start!! Press Done.."
];

const [INPUT, ANIM_HEADER, ANIM_BODY] = [0, 1, 2];

export default class Sort extends Component {
  headerRef;
  simRef;
  constructor(props) {
    super(props);
    this.state = {
      number: null,
      numbers: [],
      list: [],
      isReady: false,
      readyState: [],
      cls: {
        inputArea: "init"
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getInputRef = this.getInputRef.bind(this);
    this.getHeaderRef = this.getHeaderRef.bind(this);
    this.getSimRef = this.getSimRef.bind(this);
    this.scaleToZero = this.scaleToZero.bind(this);
    this.scaleToNormal = this.scaleToNormal.bind(this);
    this.displayNone = this.displayNone.bind(this);
    this.displayVisible = this.displayVisible.bind(this);
  }

  componentDidMount() {
    this.refs.ipnum.focus();
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
        id: uuid(),
        timeOut: 5000,
        type: nTypes.NOTIFY,
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
      let list = this.state.numbers.map((num, index) => (
        <div className="number" key={index}>
          {num}
        </div>
      ));
      this.setState({ list });
      this.refs.ipnum.value = "";
    }
  }

  getInputRef(ref) {
    this.inputRef = { ref, min: false };
  }
  getHeaderRef(ref) {
    this.headerRef = { ref, min: false };
  }

  getSimRef(ref) {
    this.simRef = { ref, min: false };
  }

  simulate() {
    if (this.state.isReady) {
      console.log(ALGO);
      return (
        <SortSimulation
          numbers={this.state.numbers}
          algo={ALGO}
          scrollToStep={this.scrollToStep}
          notify={this.props.notify}
          MinimizeHeader={this.getHeaderRef}
          minimizeSimulation={this.getSimRef}
          headerSection={ANIM_HEADER}
          animSection={ANIM_BODY}
          scaleToZero={this.scaleToZero}
          scaleToNormal={this.scaleToNormal}
          displayNone={this.displayNone}
          displayVisible={this.displayVisible}
        />
      );
    } else return null;
  }

  isValidInput() {
    const len = this.state.numbers.length;
    const number = this.state.number;
    if (!Number(number)) {
      this.props.notify({
        id: uuid(),
        type: nTypes.NOTIFY,
        msg: INVALID_NO
      });
      return false;
    }
    if (len === 5) {
      this.props.notify({
        id: uuid(),
        timeOut: 5000,
        type: nTypes.NOTIFY,
        msg: LIMIT_EXCEED
      });
      return false;
    }
    return true;
  }

  scaleToZero(section) {
    const newCls = clsUtil
      .getClsList(this.state.cls.inputArea)
      .addCls("v-scale-zero").clsStr;
    this.setState({ cls: { inputArea: newCls } });
  }

  scaleToNormal(section) {
    const newCls = clsUtil
      .getClsList(this.state.cls.inputArea)
      .removeCls("v-scale-zero").clsStr;
    this.setState({ cls: { inputArea: newCls } });
  }

  displayNone(section) {
    const newCls = clsUtil
      .getClsList(this.state.cls.inputArea)
      .addCls("disp-none").clsStr;
    this.setState({ cls: { inputArea: newCls } });
  }

  displayVisible(section) {
    const newCls = clsUtil
      .getClsList(this.state.cls.inputArea)
      .removeCls("disp-none").clsStr;
    this.setState({ cls: { inputArea: newCls } });
  }

  render() {
    return (
      <div className="sort">
        <div className="input-menubar">
          <p>Input:</p>
          <MinimizeBtn
            scaleToZero={this.scaleToZero}
            scaleToNormal={this.scaleToNormal}
            displayNone={this.displayNone}
            displayVisible={this.displayVisible}
            ref={ref => (this.getInputRef = ref)}
            sectionCode={INPUT}
          />
        </div>
        <div className={this.state.cls.inputArea}>
          <form onSubmit={this.handleSubmit} autocomplete="off">
            <input
              type="text"
              name="ipnum"
              ref="ipnum"
              onChange={this.handleBlur}
            />
            <div className="list">{this.state.list}</div>
            <div className="input-actions">
              <input
                className="btn"
                type="button"
                value="done"
                autocomplete="off"
                onClick={this.handleClick}
              />
            </div>
          </form>
        </div>
        <hr />
        <div className="simulation">{this.simulate()}</div>
      </div>
    );
  }
}

const MERGE = `function merge(a, start, mid, end) {
  const left = a.slice(start, mid + 1);       //devide array into left and right partition 
  const right = a.slice(mid + 1, end + 1);    //using start, mid and end

  let [i, j, k, l, r] = [0, 0, start, left.length, right.length];
  
  //until both halves have elements copy the smaller element
  //among both and increment pointers
  while (i < l && j < r) {
    if (left[i] < right[j]) {
      a[k++] = left[i++];
    } else if (left[i] > right[j]) {
      a[k++] = right[j++];
    } else {
      a[k++] = left[i++];
      a[k++] = right[j++];
    }
  }
  //copy remaining elements of the larger half
  while (i < l)
    a[k++] = left[i++];

  while (j < r)
    a[k++] = right[j++];
}
`;
const mergeSort = `function mergeSort(a, l, r) {
  if (l < r) {
    const m = parseInt((l + r) / 2);
    const [leftStart, leftEnd, rightStart, rightEnd] = [l, m, m + 1, r];
    //recursively call within the left half
    mergeSort(a, leftStart, leftEnd);
    //recursively call within the right half
    mergeSort(a, rightStart, rightEnd);
    //merge left and right halfs after sorting
    merge(a, l, m, r);
  }
}
`;
let ALGO = [
  { section: sortAlgo.merge.MERGE, phase: "merge", code: MERGE },
  { section: sortAlgo.merge.SPLIT, phase: "split", code: mergeSort }
];
