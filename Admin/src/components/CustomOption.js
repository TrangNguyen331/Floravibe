import React from "react";
import { components } from "react-select";

const CustomOption = ({ children, ...props }) => {
  // eslint-disable-next-line no-unused-vars
  const { onMouseMove, onMouseOver, ...rest } = props.innerProps;
  const newProps = { ...props, innerProps: rest };
  return (
    <components.Option
      {...newProps}
      className={`custom-option ${
        props.isFocused ? "custom-select__option--is-focused" : ""
      } ${props.isSelected ? "custom-select__option--is-selected" : ""}`}
    >
      {children}
    </components.Option>
  );
};

export default CustomOption;
