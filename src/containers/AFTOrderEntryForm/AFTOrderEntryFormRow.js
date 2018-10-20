import React, { Component } from "react";
import { Field } from "redux-form";
import AFTAccountField from "./../../Fields/AFTAccountField";

class AFTOrderEntryFormRow extends Component {
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
          <div
            key={index}
            style={{
              display: "flex",
              marginTop: "1rem",
              justifyContent: "space-between"
            }}
          >
            <div style={{ flex: 1, order: 1, width: "10%" }}>
              <Field
                name={`${member}.selected`}
                type="checkbox"
                component="input"
              />
            </div>
            <div style={{ order: 2, width: "20%" }}>
              <Field name={`${member}.isIn`} component="input" />
            </div>
            <div style={{ order: 3, width: "35%" }}>
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
            <div style={{ order: 4, width: "35%" }}>
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
