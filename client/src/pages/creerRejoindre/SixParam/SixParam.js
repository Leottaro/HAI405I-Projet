import { useEffect, useState } from "react";
import "./SixParam.css";

function SixParam(props) {
  // {title, min, max, defaultValue}
  const [value, setValue] = useState(0);

  function handleClick(deltaV) {
    let newValue = value + deltaV;
    if (newValue < props.min) {
      newValue = props.min;
    } else if (newValue > props.max) {
      newValue = props.max;
    }
    setValue(newValue ? newValue : parseInt((props.min + props.max) / 2));
  }

  useEffect(() => {
    setValue(props.defaultValue);
  }, [props]);

  useEffect(() => {
    props.onChange(value);
  }, [props, value]);

  return (
    <div className="parameter">
      <span>{props.desc}</span>
      <div className="inputDiv">
        <button onClick={() => handleClick(-1)}>&lt;</button>
        <input min={props.min} max={props.max} value={value + "s"} disabled />
        <button onClick={() => handleClick(+1)}>&gt;</button>
      </div>
    </div>
  );
}
export default SixParam;
