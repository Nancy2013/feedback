import React from 'react';
import Loadable from "react-loadable";
import LoadingPage from "../LoadingPage";
import Page from '../Page';
import NavBar from '../NavBar';
import { injectIntl } from 'react-intl';

const Loading = injectIntl(function({intl: {formatMessage},...rest}) {
    if(rest && rest.error){
        console.error(rest.error);
    }
    return (
        <Page saveBottom>
            <NavBar title={formatMessage({ id: 'internal.SDKTimerV2.timingSet' })} right={[]} />
            <LoadingPage />
        </Page>
    );
});

const LoadableComponent = Loadable({
  loader: () => import("./SDKTimerV2.js"),
  loading: Loading,
});

export default class LoadableDashboard extends React.Component {
    render() {
      return <LoadableComponent {...this.props}/>;
    }
  }
