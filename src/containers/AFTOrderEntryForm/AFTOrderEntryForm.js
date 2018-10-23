import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import {
  Field,
  FieldArray,
  reduxForm,
  formValueSelector,
  change,
  reset
} from "redux-form";
import AFTOrderEntryFormFundGroup from "./AFTOrderEntryFormFundGroup";

const pages = {
  AFT_ORDER_ENTRY: "AFT_ORDER_ENTRY",
  AFT_ORDER_CONFIRMATION: "AFT_ORDER_CONFIRMATION"
};

class AFTOrderEntryForm extends Component {
  state = {
    page: pages.AFT_ORDER_ENTRY,
    orderEntries: [],
    noOfSelectedOrders: 0,
    noOfConfirmSelectedOrders: 0,
    selectAll: false,
    accounts: [],
    sideOptions: [
      { value: "S", label: "Subscription" },
      { value: "R", label: "Redemption" }
    ],
    qtyTypeOptions: [
      { value: "U", label: "Units" },
      { value: "C", label: "Cash" }
    ],
    currencyUnitsOptions: [
      { value: "FundCCY", label: "Fund CCY" },
      { value: "EUR", label: "EUR" }
    ],
    currencyCashOptions: [
      { value: "abc1", label: "abc1" },
      { value: "abc2", label: "abc2" }
    ]
  };
  static getDerivedStateFromProps(props, state) {
    let accounts = state.accounts.length === 0 ? [] : state.accounts;
    let currencyCashOptions =
      state.currencyCashOptions.length === 0 ? [] : state.currencyCashOptions;
    let orderEntriesRef = state.orderEntries;
    if (
      props.viewer &&
      props.viewer.aftAccountNumbers &&
      props.viewer.aftAccountNumbers.length > 0
    ) {
      accounts = props.viewer.aftAccountNumbers.map(entity => ({
        value: entity,
        label: entity
      }));
    }
    if (props.currencies) {
      currencyCashOptions = props.currencies.map(entity => ({
        value: entity.currencyId,
        label: entity.currencyCode
      }));
    }
    if (orderEntriesRef.length === 0) {
      orderEntriesRef = props.initialValues.orderEntries;
    }
    let noOfSelectedOrdersRef,
      noOfConfirmSelectedOrders = 0;
    if (props.orderEntries) {
      noOfSelectedOrdersRef = props.orderEntries.filter(order => order.selected)
        .length;
      noOfConfirmSelectedOrders = props.orderEntries.filter(
        order => order.confirmSelected
      ).length;
    }
    let { message, snackbar } = state;
    if (state.page === pages.AFT_ORDER_ENTRY) {
      message = undefined;
      snackbar = undefined;
    }
    return {
      orderEntries: orderEntriesRef,
      accounts,
      currencyCashOptions,
      noOfSelectedOrders: noOfSelectedOrdersRef,
      noOfConfirmSelectedOrders,
      message,
      snackbar
    };
  }
  renderHeader = () => (
    <div className="d-flex flex-row justify-content-between">
      <div className="p-2">
        <Field
          name="selectAll"
          type="checkbox"
          onChange={this.onSelectAllFieldChange}
          value={this.state.selectAll}
          component="input"
        />
      </div>
      <div className="p-2">Account Number</div>
      <div className="p-2">ISIN</div>
      <div className="p-2">Side</div>
      <div className="p-2">Qty Type</div>
      <div className="p-2">Amount</div>
      <div className="p-2">Currency</div>
      <div className="p-2">Client Reference</div>
    </div>
  );

  validateOrderEntityRow = (values, allValues, props) => {
    console.log("~~~ validateOrderEntityRow ", values, allValues, props);
    const errors = [];
    _.forEach(values, (row, index) => {
      let validationEntries = null;
      if (row.selected) {
        validationEntries = {};
        if (!row.accounts) {
          validationEntries.accounts = "Account number required";
        }
        if (!row.isin) {
          validationEntries.isin = "IsIn value required";
        } else {
          const reg = /^[a-zA-Z][a-zA-Z][0-9]+$/;
          if (row.isin && row.isin.length !== 12) {
            validationEntries.isin =
              "First two characters must be strings & maximum 12 characters are allowed.";
          }
          if (!reg.test(row.isin)) {
            validationEntries.isin = "First two characters must be strings";
          }
        }
        if (!row.side) {
          validationEntries.side = "Required";
        }
        if (!row.qtyType) {
          validationEntries.qtyType = "Required";
        }
        if (!row.currency) {
          validationEntries.currency = "Required";
        }
        let amountFieldValidation;
        if (row.qtyType === "U") {
          amountFieldValidation = {
            reg: /^[0-9]*(?:\.[0-9]{0,4})?$/,
            message: "Allowed max four decimals"
          };
        } else if (row.qtyType === "C") {
          amountFieldValidation = {
            reg: /^[0-9]*(?:\.[0-9]{0,2})?$/,
            message: "Allowed max two decimals"
          };
        }

        if (!row.amount) {
          validationEntries.amount = "Amount value required";
        } else {
          if (!amountFieldValidation.reg.test(row.amount)) {
            validationEntries.amount = amountFieldValidation.message;
          }
        }
        console.log(
          "~~~ _.keys(validationEntries) ",
          _.keys(validationEntries)
        );
        if (_.keys(validationEntries).length === 0) {
          validationEntries = null;
        }
      }
      errors.push(validationEntries);
    });
    console.log("~~~ validateOrderEntityRow ", errors, this.props);
    let valid = true;
    _.forEach(errors, item => {
      if (item) {
        valid = false;
      }
    });
    return valid ? undefined : errors;
  };

  onSubmit = values => {
    console.log("~~~~~~~ onSubmit ", values);
  };

  setCurrencyByQtyType = (qtyTypeValue, selectedRowIndex) => {
    const { orderEntries } = this.props;
    orderEntries[selectedRowIndex].currency = undefined;
    this.props.updateOrderEntriesState("orderEntries", orderEntries);
  };

  onQtyTypeChange = (event, newValue, previousValue, name) => {
    const selectedRowIndex = parseInt(name.match(/\d+/)[0], 10);
    this.setCurrencyByQtyType(newValue, selectedRowIndex);
  };

  render() {
    const { handleSubmit, pristine, submitting, error } = this.props;
    console.log("~~~~~~~~~ AFTOrderEntryForm ", this.props, error);
    let disabled = pristine || submitting;
    const {
      page,
      orderEntries,
      sideOptions,
      qtyTypeOptions,
      currencyUnitsOptions,
      currencyCashOptions,
      accounts
    } = this.state;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div className="card">
          <div className="card-header">Order Entity</div>
          <div className="card-body">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                overflowX: "auto",
                overflowY: "auto"
              }}
            >
              {this.renderHeader()}
              <FieldArray
                name="orderEntries"
                component={AFTOrderEntryFormFundGroup}
                sideOptions={sideOptions}
                qtyTypeOptions={qtyTypeOptions}
                currencyUnitsOptions={currencyUnitsOptions}
                currencyCashOptions={currencyCashOptions}
                onQtyTypeChange={this.onQtyTypeChange}
                accounts={accounts}
                validate={this.validateOrderEntityRow}
              />
            </div>
          </div>
          <div className="card-footer">
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={disabled && this.state.noOfSelectedOrders > 0}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const formAFTOrderEntry = formValueSelector("AFTOrderEntry");
function mapStateToProps(state) {
  const orderEntries = [
    {
      selected: false,
      accounts: "Hdfc00123456789",
      qtyType: "U",
      currency: "FundCCY",
      isin: "AB1234567890",
      side: "S",
      amount: "1235.1234",
      clientreference: "AS"
    },
    {
      selected: false,
      accounts: "Axis00123456789",
      qtyType: "C",
      currency: "abc2",
      isin: "AB1234567890",
      side: "S",
      amount: "1235.1234",
      clientreference: "AS"
    },
    {
      selected: false,
      accounts: "ICICI00123456789",
      qtyType: "C",
      currency: "abc1",
      isin: "",
      side: "",
      amount: "",
      clientreference: ""
    }
  ];
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

function mapDispatchToProps(dispatch) {
  return {
    // onSubmit(values) {},
    updateOrderEntriesState(key, val) {
      dispatch(change("AFTOrderEntry", key, val));
    },
    resetForm() {
      dispatch(reset("AFTOrderEntry"));
    }
  };
}

AFTOrderEntryForm = reduxForm({
  form: "AFTOrderEntry",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(AFTOrderEntryForm);

export default (AFTOrderEntryForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AFTOrderEntryForm));
