import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field } from "redux-form";

class AFTOrderEntryFormFundGroup extends Component {
  static propTypes = {
    fields: PropTypes.shape(PropTypes.object),
    meta: PropTypes.shape(PropTypes.object),
    onQtyTypeChange: PropTypes.func,
    sideOptions: PropTypes.arrayOf(PropTypes.object),
    qtyTypeOptions: PropTypes.arrayOf(PropTypes.object),
    currencyUnitsOptions: PropTypes.arrayOf(PropTypes.object),
    currencyCashOptions: PropTypes.arrayOf(PropTypes.object)
  };

  renderSelectTypeField = field => {
    const { input, disabled, options, meta } = field;
    console.log("~~~~~~~~~ renderSelectTypeField ", field);
    const fieldName = input.name.split(".")[1];
    const rowNum = parseInt(input.name.match(/\d+/)[0], 10);
    console.log("~~~~~~~~~ fieldName ", fieldName, rowNum);
    return (
      <div className="input-row">
        <select {...field.input} disabled={disabled}>
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
        {field.meta.touched &&
          this.props.meta.error[rowNum] && (
            <span className="text-danger">
              {this.props.meta.error[rowNum][fieldName]}
            </span>
          )}
      </div>
    );
  };

  renderTextTypeField = field => {
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
        {field.meta.touched &&
          this.props.meta.error[rowNum] && (
            <span className="text-danger">
              {this.props.meta.error[rowNum][fieldName]}
            </span>
          )}
      </div>
    );
  };

  render() {
    const isLoading = false;
    const {
      fields,
      meta,
      sideOptions,
      qtyTypeOptions,
      currencyUnitsOptions,
      currencyCashOptions,
      ...rest
    } = this.props;
    console.log("~>>> Render() <::::> AFTOrderEntryFormFundGroup ", meta);
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around"
          }}
        >
          {fields.getAll().length === 0 ? (
            <div>
              <h5>Please add at least one order entry.</h5>
            </div>
          ) : (
            ""
          )}
        </div>
        {fields.map((member, index) => {
          const row = fields.get(index);
          return (
            <div className="d-flex flex-row justify-content-between">
              <div className="p-2">
                <Field
                  name={`${member}.selected`}
                  type="checkbox"
                  component="input"
                />
              </div>
              <div className="p-2">
                {this.props.accounts.length > 0 ? (
                  <Field
                    name={`${member}.accounts`}
                    {...rest}
                    options={this.props.accounts}
                    component={this.renderSelectTypeField}
                    disabled={!row.selected}
                  />
                ) : (
                  <Field
                    name={`${member}.accounts`}
                    placeholder="Account"
                    component={this.renderTextTypeField}
                    disabled={!row.selected}
                  />
                )}
              </div>
              <div className="p-2">
                <Field
                  name={`${member}.isin`}
                  placeholder="ISIN"
                  component={this.renderTextTypeField}
                  disabled={!row.selected}
                />
              </div>
              <div className="p-2">
                <Field
                  name={`${member}.side`}
                  options={sideOptions}
                  component={this.renderSelectTypeField}
                  disabled={!row.selected}
                />
              </div>
              <div className="p-2">
                <Field
                  name={`${member}.qtyType`}
                  {...rest}
                  options={qtyTypeOptions}
                  onChange={this.props.onQtyTypeChange}
                  component={this.renderSelectTypeField}
                  disabled={!row.selected}
                />
              </div>
              <div className="p-2">
                <Field
                  name={`${member}.amount`}
                  placeholder="Amount"
                  component={this.renderTextTypeField}
                  disabled={!row.selected}
                />
              </div>
              <div className="p-2">
                <Field
                  name={`${member}.currency`}
                  options={
                    fields.get(index).qtyType === "U"
                      ? currencyUnitsOptions
                      : currencyCashOptions
                  }
                  component={this.renderSelectTypeField}
                  disabled={!row.selected}
                />
              </div>
              <div className="p-2">
                <Field
                  name={`${member}.clientreference`}
                  placeholder="Client Reference"
                  component={this.renderTextTypeField}
                  disabled={!row.selected}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
export default AFTOrderEntryFormFundGroup;
