import React, { Component } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";

const withQuery = ({
  query: queryHOC,
  variables: variablesHOC,
  pollInterval: pollIntervalHOC,
  notifyOnNetworkStatusChange: notifyOnNetworkStatusChangeHOC,
  fetchPolicy: fetchPolicyHOC,
  errorPolicy: errorPolicyHOC,
  ssr: ssrHOC,
  displayName: displayNameHOC,
  skip: skipHOC,
  onCompleted: onCompletedHOC,
  onError: onErrorHOC,
  context: contextHOC,
  partialRefetch: partialRefetchHOC,
  render: renderHOC
}) => ComposedComponent =>
  class extends Component {
    static propTypes = {
      // eslint-disable-next-line react/forbid-prop-types
      query: PropTypes.object,
      variables: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
      pollInterval: PropTypes.number,
      notifyOnNetworkStatusChange: PropTypes.bool,
      fetchPolicy: PropTypes.oneOf([
        "cache-first",
        "cache-and-network",
        "network-only",
        "cache-only",
        "no-cache"
      ]),
      errorPolicy: PropTypes.oneOf(["none", "ignore", "all"]),
      ssr: PropTypes.bool,
      displayName: PropTypes.string,
      skip: PropTypes.bool,
      onCompleted: PropTypes.func,
      onError: PropTypes.func,
      // eslint-disable-next-line react/forbid-prop-types
      context: PropTypes.object,
      partialRefetch: PropTypes.bool,
      render: PropTypes.func,
      ...ComposedComponent.propTypes
    };

    state = {
      hasError: false
    };

    componentDidCatch(error, info) {
      // TODO: do something with errors when not in dev
      this.setState({ hasError: true });
      // eslint-disable-next-line no-console
      console.error(error, info);
    }

    render() {
      const {
        query: queryProp,
        variables: variablesProp,
        pollInterval: pollIntervalProp,
        notifyOnNetworkStatusChange: notifyOnNetworkStatusChangeProp,
        fetchPolicy: fetchPolicyProp,
        errorPolicy: errorPolicyProp,
        ssr: ssrProp,
        displayName: displayNameProp,
        skip: skipProp,
        onCompleted: onCompletedProp,
        onError: onErrorProp,
        context: contextProp,
        partialRefetch: partialRefetchProp,
        render: renderProp,
        ...rest
      } = this.props;

      const variables = variablesProp || variablesHOC;

      const queryVariables =
        typeof variables === "function" ? variables(this.props) : variables;

      const defaultRenderer = ({ loading, error, data }) => {
        if (error) {
          // TODO: implement error
          return <div>Something went wrong</div>;
        }
        if (loading) {
          return (
            <ComposedComponent isLoading {...rest} variables={queryVariables} />
          );
        }

        return (
          <ComposedComponent
            isLoading={false}
            {...rest}
            {...data}
            variables={queryVariables}
          />
        );
      };

      return (
        <Query
          query={queryProp || queryHOC}
          variables={queryVariables}
          pollInterval={pollIntervalProp || pollIntervalHOC}
          notifyOnNetworkStatusChange={
            notifyOnNetworkStatusChangeProp || notifyOnNetworkStatusChangeHOC
          }
          fetchPolicy={fetchPolicyProp || fetchPolicyHOC}
          errorPolicy={errorPolicyProp || errorPolicyHOC}
          ssr={ssrProp || ssrHOC}
          displayName={displayNameProp || displayNameHOC}
          skip={skipProp || skipHOC}
          onCompleted={onCompletedProp || onCompletedHOC}
          onError={onErrorProp || onErrorHOC}
          context={contextProp || contextHOC}
          partialRefetch={partialRefetchProp || partialRefetchHOC}
        >
          {renderProp || renderHOC || defaultRenderer}
        </Query>
      );
    }
  };

export default withQuery;
