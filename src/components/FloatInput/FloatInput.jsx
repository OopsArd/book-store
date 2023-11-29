import React, {useState} from 'react'
import { Input } from 'antd';
import './FloatInput.css'

const FloatInput = ({ label, placeholder, value, handleInput, required, type }) => {
    const [focus, setFocus] = useState(false);
    const [input, setInput] = useState('');
  
    if (!placeholder) placeholder = label;
  
    const isOccupied = focus || (value && value.length !== 0);
    const labelClass = isOccupied ? "label as-label" : "label as-placeholder";
    const requiredMark = required ? <span className="text-danger">*</span> : null;

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            handleInput(input)
        }
    }

    const handleOnChange = (e) => {
        let valueInput = e.target.value;
        setInput(valueInput)
        console.log("input: ", input);
    }

    
  
    return (
      <div className="float-label" onFocus={() => setFocus(true)}>
        <Input onKeyDown={handleKeyDown} onChange={handleOnChange} value={input} type={type} defaultValue={value} />
        <label className={labelClass}>
          {isOccupied ? label : placeholder} {requiredMark}
        </label>
      </div>
    );
}

export default FloatInput