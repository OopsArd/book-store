import React, {useState} from 'react'
import { Input } from 'antd';
import './FloatInput.css'

const FloatInput = ({ width, handleFocus, handleDisable, isFocus, disable, label, placeholder, value, handleInput, required, type }) => {
    const [focus, setFocus] = useState(false);
    const [input, setInput] = useState(value || '');
  
    if (!placeholder) placeholder = label;
  
    const isOccupied = focus || (value && value.length !== 0);
    const labelClass = isOccupied ? "label as-label" : "label as-placeholder";
    const requiredMark = required ? <span className="text-danger">*</span> : null;

    const handleOnChange = (e) => {
        let valueInput = e.target.value;
        handleInput(valueInput)
        setInput(valueInput)
    }

    const handleFocusInput = (value) => {
      setFocus(value);
      if(disable !== null){
        handleDisable(value);
      }
      if(isFocus){
        handleFocus(value);
      }
    }

    const handleBlur = (value) => {
      if(disable !== null){
        handleDisable(!value);
      }
      if(input.length <= 0){
        setFocus(!value);
      }
    }
  
    return (
      <div className="float-label" style={{width: `${width ? width : '500px'}`}} onBlur={() => handleBlur(true)} onFocus={() => handleFocusInput(true)}>
        <Input disabled={disable} className='input' onChange={handleOnChange} value={input} type={type} />
        <label className={labelClass}>
          {isOccupied ? label : placeholder} {requiredMark}
        </label>
      </div>
    );
}

export default FloatInput