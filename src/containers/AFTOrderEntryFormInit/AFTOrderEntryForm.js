import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import {
  Field,
  FieldArray,
  reduxForm,
  formValueSelector,
  change
} from "redux-form";

import AFTOrderEntryFormRow from "./AFTOrderEntryFormRow";

class AFTOrderEntryForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    meta: PropTypes.object,
    title: PropTypes.string,
    getAllAccounts: PropTypes.func,
    getSelectedOrdersCount: PropTypes.func,
    onSubmit: PropTypes.func
  };
  state = {
    orderEntries: [],
    selectAll: false,
    noOfSelectedOrders: 0,
    accounts: [],
    qtyType: [
      { id: "fund", displayName: "Fund" },
      { id: "cash", displayName: "Cash" }
    ],
    currency: { 0: [], 1: [], 2: [] },
    cash: [
      { id: "abc", displayName: "abc" },
      { id: "def", displayName: "def" },
      { id: "ghi", displayName: "ghi" }
    ],
    fund: [
      { id: "fund1", displayName: "fund1" },
      { id: "fund2", displayName: "fund2" }
    ]
  };

  static getDerivedStateFromProps(props, state) {
    console.log("~~~~~~~~~~~~ getDerivedStateFromProps ", props, state);
    const stateEntity = state;
    state.accounts = props.getAllAccounts();
    state.orderEntries = props.orderEntries;
    state.selectAll = props.selectAll;
    state.noOfSelectedOrders = props.getSelectedOrdersCount(state.orderEntries);
    return stateEntity;
  }

  onSelectAllFieldChange = (event, newValue, previousValue, name) => {
    const { orderEntries } = this.state;
    _.forEach(orderEntries, item => {
      item.selected = newValue;
    });
    this.props.updateOrderEntriesState("orderEntries", orderEntries);
    const noOfSelectedOrders = this.props.getSelectedOrdersCount(
      this.state.orderEntries
    );
    this.setState({ noOfSelectedOrders: noOfSelectedOrders });
  };

  addNewOrderEntry = () => {
    const { orderEntries, selectAll, currency } = this.state;
    currency[orderEntries.length] = [];
    orderEntries.push({ selected: selectAll });
    console.log("~~~~~~~ addNewOrderEntity ", orderEntries);
    this.props.updateOrderEntriesState("orderEntries", orderEntries);
    const noOfSelectedOrders = this.props.getSelectedOrdersCount(
      this.state.orderEntries
    );
    this.setState({ noOfSelectedOrders: noOfSelectedOrders });
  };

  removeSelectedOrderEntry = () => {
    const { orderEntries } = this.state;
    _.remove(orderEntries, item => {
      return item.selected;
    });
    this.props.updateOrderEntriesState("orderEntries", orderEntries);
    this.props.updateOrderEntriesState("selectAll", false);
    const noOfSelectedOrders = this.props.getSelectedOrdersCount(
      this.state.orderEntries
    );
    this.setState({ noOfSelectedOrders: noOfSelectedOrders });
  };

  onQtyTypeSelectChange = (event, newValue, previousValue, name) => {
    console.log(
      ">>>> onQtyTypeSelectChange --->> ",
      event,
      newValue,
      previousValue,
      name
    );
    var numb = name.match(/\d/g);
    numb = numb.join("");
    const { currency } = this.state;
    currency[numb] = this.state[newValue];
    this.setState({ currency });
  };

  arrayHasInvalid(array) {
    let hasInvalid = false;
    for (let i = 0; i < array.length; i += 1) {
      if (array[i]) {
        hasInvalid = true;
        break;
      }
    }
    return hasInvalid;
  }

  orderEntryRowValidation = values => {
    console.log("1 ~~~~~~~ orderEntryRowValidation >>> ", values);
    if (!values.length) return;
    const errorsArray = [];
    values.forEach((value, index) => {
      if (value) {
        const errors = {};
        if (!value.isIn) errors.isIn = "isIn Required";
        if (Object.keys(errors).length) {
          errorsArray[index] = errors;
        }
      }
    });
    console.log("2 ~~~~~~~ orderEntryRowValidation >>> ", errorsArray);
    return this.arrayHasInvalid(errorsArray) ? errorsArray : undefined;
  };

  onSubmit = values => {
    this.props.onSubmit(values);
  };
  render() {
    const { handleSubmit, title, meta } = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div className="card mt-5">
          <div className="card-header">
            <div className="card-title">{title}</div>
          </div>
          <div className="card-body">
            <div className="d-flex flex-column" style={{ overflowX: "auto" }}>
              <div className="row">
                <div className="col-2">
                  <Field
                    name="selectAll"
                    type="checkbox"
                    onChange={this.onSelectAllFieldChange}
                    component="input"
                    value={this.state.selectAll}
                  />
                </div>
                <div className="col-4">IsIn</div>
                <div className="col-3">Qty.Type</div>
                <div className="col-3">Currency</div>
              </div>
              <div className="mb-5">
                <FieldArray
                  name="orderEntries"
                  component={AFTOrderEntryFormRow}
                  accounts={this.state.accounts}
                  qtyType={this.state.qtyType}
                  currency={this.state.currency}
                  onQtyTypeSelectChange={this.onQtyTypeSelectChange}
                  validate={this.orderEntryRowValidation}
                />
              </div>
            </div>
          </div>
          <div className="card-footer">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                flexWrap: "wrap"
              }}
            >
              <button
                className="btn btn-primary mr-2"
                type="submit"
                disabled={this.state.noOfSelectedOrders === 0}
              >
                Enter Selected Orders{" "}
                {this.state.noOfSelectedOrders > 0
                  ? this.state.noOfSelectedOrders
                  : ""}
              </button>
              <button
                className="btn btn-default mr-2"
                onClick={this.addNewOrderEntry}
                type="button"
              >
                Add More Orders
              </button>
              <button
                className="btn btn-default mr-2"
                type="button"
                onClick={this.removeSelectedOrderEntry}
              >
                Remove Selected Orders
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.orderEntries || !values.orderEntries.length) {
    errors.orderEntries = { _error: "At least one order must be selected" };
  } else {
    const membersArrayErrors = [];
    errors.orderEntries = { _error: undefined };
    values.orderEntries.forEach((member, memberIndex) => {
      const memberErrors = {};
      if (!member.accounts) {
        memberErrors.accounts = "Required";
        membersArrayErrors[memberIndex] = memberErrors;
      }
    });

    if (membersArrayErrors.length) {
      errors.orderEntries = membersArrayErrors;
    }
  }
  return errors;
};

AFTOrderEntryForm = reduxForm({
  form: "AFTOrderEntry",
  validate
})(AFTOrderEntryForm);

const formAFTOrderEntry = formValueSelector("AFTOrderEntry");

function mapStateToProps(state, ownProps) {
  const orderEntries = [{ selected: true, accounts: "32214783" }];
  const selectAll = false;
  const initialValues = {
    selectAll,
    orderEntries
  };
  return {
    initialValues,
    selectAll: formAFTOrderEntry(state, "selectAll"),
    orderEntries: formAFTOrderEntry(state, "orderEntries")
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onSubmit(values) {
      console.log("Selected Form Values ", values);
    },
    updateOrderEntriesState(key, val) {
      dispatch(change("AFTOrderEntry", key, val));
    },
    getAllAccounts() {
      let accounts = [];
      accounts.push({ id: 32214782, displayName: "Account 1" });
      accounts.push({ id: 32214783, displayName: "Account 2" });
      accounts.push({ id: 32214784, displayName: "Account 3" });
      accounts.push({ id: 32214785, displayName: "Account 4" });
      accounts.push({ id: 32214786, displayName: "Account 5" });
      return accounts;
    },
    getSelectedOrdersCount(orderEntries) {
      const selectedOrders = _.filter(orderEntries, o => {
        return o.selected;
      });
      return selectedOrders.length;
    }
  };
}

export default (AFTOrderEntryForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AFTOrderEntryForm));
