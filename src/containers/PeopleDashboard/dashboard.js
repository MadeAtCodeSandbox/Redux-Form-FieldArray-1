import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import $ from "jquery";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/css/bootstrap.css";

const pages = {
  UPLOAD_SECTION: "UPLOAD_SECTION",
  VIEW_GRID: "VIEW_GRID"
};
const query = gql`
            {
              allPeople{
                people{
                  id
                  name
                  height
                  gender
                  homeworld {
                    id
                    name
                  }
                }
              }
            }
          `;
class PeopleDashboard extends Component {
  state = {
    page: undefined,
    selectedFileName: "",
    browseFileName: ""
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("~~~~~>> getDerivedStateFromProps ::== ", nextProps, prevState);
    let { page } = prevState;
    if (!page) {
      page = pages.UPLOAD_SECTION;
    }
    return { page };
  }

  onFileSelection(event) {
    console.log(
      "~~~~~ onFileSelection ::> ",
      event.target.files[0],
      $("#actFile").val(),
      this.state
    );
    const fileObj = event.target.files[0];
    this.setState({
      selectedFileName: fileObj.name,
      file: event.target.files[0]
    });
    let formData = new FormData();
    formData.append("testFile", this.state.file, "test.test");
    formData.append("otherData", "canBeAnythingYouWant");
    fetch("https://httpbin.org/post", {
      method: "POST",
      body: formData
    })
      .then(data => data.json())
      .then(json => this.setState({ json }));
    console.log("~~~~~~~ Set after file upload ", this.state);
  }

  renderCardContainer() {
    const { page } = this.state;
    if (page === pages.VIEW_GRID) {
      return (
        <Query query={query}>
          {({ loading, error, data }) => {
            if (loading) return null;
            if (error) return `Error!: ${error}`;
            return (
              <div>
                <div className="row">
                  <div className="col-1 font-weight-bold">
                    <input type="checkbox" />
                  </div>
                  <div className="col-3 font-weight-bold">Name</div>
                  <div className="col-3 font-weight-bold">Height</div>
                  <div className="col-3 font-weight-bold">Gender</div>
                  <div className="col-2 font-weight-bold">HomeTown</div>
                </div>
                <div className="row border-top" />
                <div style={{ overflow: "auto", height: "14rem" }}>
                  {data.allPeople.people.map(item => {
                    return (
                      <div className="row" key={item.id}>
                        <div className="col-1">
                          <input type="checkbox" />
                        </div>
                        <div className="col-3">{item.name}</div>
                        <div className="col-3">{item.height}</div>
                        <div className="col-3">{item.gender}</div>
                        <div className="col-2">{item.homeworld.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }}
        </Query>
      );
    } else if (page === pages.UPLOAD_SECTION) {
      return (
        <div className="d-flex flex-column">
          <div style={{ display: "flex", marginTop: "1rem" }}>
            <input
              type="text"
              id="browseFileName"
              name="browseFileName"
              value={this.state.selectedFileName}
              style={{ width: "100%" }}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => document.getElementById("actFile").click()}
            >
              Browse
            </button>
          </div>
          <input
            type="file"
            style={{ display: "none" }}
            id="actFile"
            name="actFile"
            onChange={event => this.onFileSelection(event)}
          />
          {this.state.json ? (
            <div>
              Response:<pre>{JSON.stringify(this.state.json, null, 2)}</pre>
            </div>
          ) : null}
        </div>
      );
    }
  }

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-content-between">
              <div>All People</div>
              <div>
                <button
                  className="btn btn-warning ml-2"
                  onClick={() => {
                    this.setState({ page: pages.UPLOAD_SECTION });
                  }}
                >
                  Upload
                </button>
                <button
                  className="btn btn-warning ml-2"
                  onClick={() => {
                    this.setState({ page: pages.VIEW_GRID });
                  }}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">{this.renderCardContainer()}</div>
          <div className="card-footer">
            <div className="d-flex flex-row-reverse justify-content-left">
              <button className="btn btn-primary ml-2">Next Page</button>
              <button className="btn btn-danger ml-2">Prev Page</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PeopleDashboard;
