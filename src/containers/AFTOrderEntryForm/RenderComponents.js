import React, { Component, Fragment } from "react";

export class renderSelectTypeField extends Component {
  state = {
    value: this.props.input.value
  };

  handleChange = ({ target: { value } }) => {
    this.props.input.onChange(value);
    this.setState({ value });
  };

  render() {
    const { input, disabled, options, meta } = this.props;
    console.log("~~~~~~~~~ renderSelectTypeField ", this.props);
    const fieldName = input.name.split(".")[1];
    const rowNum = parseInt(input.name.match(/\d+/)[0], 10);
    const { value } = this.state;
    console.log("~~~~~~~~~ fieldName ", fieldName, rowNum);
    return (
      <div className="input-row">
        <select
          onChange={this.handleChange}
          name={input.name}
          value={value}
          disabled={disabled}
        >
          <option />
          {options.map((item, index) => {
            return (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
        {meta.touched &&
          meta.error && <span className="error">{meta.error}</span>}
      </div>
    );
  }
}

export const renderTextTypeField = field => {
  const fieldName = field.input.name.split(".")[1];
  const rowNum = parseInt(field.input.name.match(/\d+/)[0], 10);
  return (
    <div className="input-row">
      <input
        {...field.input}
        type="text"
        placeholder={field.placeholder}
        disabled={field.disabled}
      />
      {field.meta.touched &&
        field.meta.error && <span className="error">{field.meta.error}</span>}
    </div>
  );
};
