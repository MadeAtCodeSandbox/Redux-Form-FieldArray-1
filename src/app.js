import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import store from "./store";
import PeopleDashboard from "./containers/PeopleDashboard/dashboard";

class App extends Component {
  constructor(...args) {
    super(...args);

    this.client = new ApolloClient({
      uri: "https://swapi.apis.guru",
      dataIdFromObject: r => r.id
    });
  }
  render() {
    return (
      <ApolloProvider client={this.client}>
        <Provider store={store}>
          <PeopleDashboard />
        </Provider>
      </ApolloProvider>
    );
  }
}

export default App;
