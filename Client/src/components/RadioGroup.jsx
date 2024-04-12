import { Radio } from 'antd';
import React from 'react';

const RadioGroup = ({ options, defaultValue, size, optionType, onChange }) => {
  const [value, setValue] = React.useState(defaultValue);

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div>
      <Radio.Group size={size} optionType={optionType} options={options} onChange={handleChange} value={value} />
    </div>
  );
};

export default RadioGroup;
