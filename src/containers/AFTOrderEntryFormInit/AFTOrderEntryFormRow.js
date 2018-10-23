import React, { Component } from "react";
import { Field } from "redux-form";
import AFTAccountField from "./../../Fields/AFTAccountField";

class AFTOrderEntryFormRow extends Component {
  testInput = ({ input, meta, ...rest }) => {
    console.log(input.name + " touched?", meta.touched);
    console.log(input.name + " error?", meta.error);
    return (
      <div>
        <input {...input} {...rest} />
        <div className="field-error-text">{meta.touched && meta.error}</div>
      </div>
    );
  };

  render() {
    const { fields, options, meta } = this.props;
    const { touched, error, submitFailed } = meta;
    return (
      <div>
        <div>
          {error && fields.getAll().length === 0 ? (
            <div
              style={{
                borderTop: "1px solid gray",
                display: "flex",
                justifyContent: "space-around"
              }}
            >
              <h6>{error}</h6>
            </div>
          ) : (
            ""
          )}
        </div>
        {fields.map((member, index) => (
          <div key={member} className="row mt-3">
            <div className="col-2">
              <Field
                name={`${member}.selected`}
                type="checkbox"
                component="input"
              />
            </div>
            <div className="col-4">
              <Field name={`${member}.isIn`} component={this.testInput} />
            </div>
            <div className="col-3">
              <Field
                name={`${member}.qtyType`}
                component="select"
                onChange={this.props.onQtyTypeSelectChange}
              >
                <option />
                {this.props.qtyType.map((item, index) => {
                  return (
                    <option key={index} value={item.id}>
                      {item.displayName}
                    </option>
                  );
                })}
              </Field>
            </div>
            <div className="col-3">
              <Field name={`${member}.currency`} component="select">
                <option />
                {this.props.currency[index].map((item, index) => {
                  return (
                    <option key={index} value={item.id}>
                      {item.displayName}
                    </option>
                  );
                })}
              </Field>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
export default AFTOrderEntryFormRow;
