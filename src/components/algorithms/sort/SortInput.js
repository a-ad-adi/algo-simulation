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
        inputArea: "init",
        animHeader: "sol-header",
        animBody: "sol-body"
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
      return (
        <SortSimulation
          numbers={this.state.numbers}
          algo={ALGO}
          scrollToStep={this.scrollToStep}
          notify={this.props.notify}
          clearNotifications={this.props.clearNotifications}
          MinimizeHeader={this.getHeaderRef}
          minimizeSimulation={this.getSimRef}
          animHeaderSection={ANIM_HEADER}
          animBodySection={ANIM_BODY}
          scaleToZero={this.scaleToZero}
          scaleToNormal={this.scaleToNormal}
          displayNone={this.displayNone}
          displayVisible={this.displayVisible}
          animHeaderCls={this.state.cls.animHeader}
          animBodyCls={this.state.cls.animBody}
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

  mapSectionWithCode(code){
    switch(code){
      case INPUT:
        return this.state.cls.inputArea;
      case ANIM_HEADER:
        return this.state.cls.animHeader;
      case ANIM_BODY:
        return this.state.cls.animBody;
      default:
        console.error("Invalid section code");
        return null;
    }
  }
  scaleToZero(section) {
    let clsObj = this.state.cls;
    
    const newCls = clsUtil
      .getClsList(this.state.cls.inputArea)
      .addCls("v-scale-zero").clsStr;

    if (section === INPUT || section === ANIM_HEADER) {
      let animBodyCls = clsUtil
        .getClsList(this.state.cls.animBody)
        .addCls("sol-body-expand").clsStr;
      clsObj.animBody = animBodyCls;
    }

    clsObj.inputArea = newCls;
    this.setState({ cls: clsObj });
  }

  scaleToNormal(section) {
    let clsObj = this.state.cls;
    const newCls = clsUtil
      .getClsList(this.state.cls.inputArea)
      .removeCls("v-scale-zero").clsStr;

    if (section === INPUT || section === ANIM_HEADER) {
      let animBodyCls = clsUtil
        .getClsList(this.state.cls.animBody)
        .removeCls("sol-body-expand").clsStr;
      clsObj.animBody = animBodyCls;
    }

    clsObj.inputArea = newCls;
    this.setState({ cls: clsObj });
  }

  displayNone(section) {
    let clsObj = this.state.cls;
    const newCls = clsUtil
      .getClsList(this.state.cls.inputArea)
      .addCls("disp-none").clsStr;

    clsObj.inputArea = newCls;
    this.setState({ cls: clsObj });
  }

  displayVisible(section) {
    let clsObj = this.state.cls;
    const newCls = clsUtil
      .getClsList(this.state.cls.inputArea)
      .removeCls("disp-none").clsStr;

    clsObj.inputArea = newCls;
    this.setState({ cls: clsObj });
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
          <form onSubmit={this.handleSubmit} autoComplete="off">
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
                autoComplete="off"
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
