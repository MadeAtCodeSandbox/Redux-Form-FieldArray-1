import React, { Component, Fragment } from "react";
import TextField from "material-ui/TextField";
import { MenuItem } from "material-ui/Menu";

const offerTypes = [
  { value: "primary", label: "Primary" },
  { value: "presale", label: "Presale" },
  { value: "premium", label: "Premium" }
];

export class TypeInput extends Component {
  state = {
    value: this.props.input.value
  };

  handleChange = ({ target: { value } }) => {
    this.props.input.onChange(value);
    this.setState({ value });
  };

  render() {
    const {
      input,
      meta: { touched, error }
    } = this.props;
    const { value } = this.state;
    return (
      <TextField select label="Type" value={value} onChange={this.handleChange}>
        {offerTypes.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>
    );
  }
}

const priceInputProps = {
  inputProps: { step: "0.5" }
};

export const PriceInput = ({ input, meta: { touched, error } }) => (
  <TextField
    {...input}
    label="Price"
    type="number"
    InputProps={priceInputProps}
  />
);

export const UrlInput = ({ input, meta: { touched, error } }) => {
  console.log("~~~~~~~~~~~~ UrlInput ", error);
  return (
    <TextField
      {...input}
      type="url"
      label="URL"
      error={!!error}
      helperText={error}
    />
  );
};
