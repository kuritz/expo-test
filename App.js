import React from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import * as Permissions from 'expo-permissions';
import Sentry from 'sentry-expo';

import AppIndex from './src/index';
import store from './src/redux/store';

const types = [
  Permissions.SYSTEM_BRIGHTNESS,
  Permissions.LOCATION,
  Permissions.CAMERA
]

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    await this.handlePermissions();
  }

  async componentDidUpdate() {
    await this.handlePermissions();
  }

  async handlePermissions() {
    const { status } = await Permissions.getAsync(...types)
    if ( status !== "granted" ) {
      Alert.alert(
        "Please Grant Required Permissions",
        "This app requires permissions to function properly. "
          + "Please grant permissions when prompted.",
        [{text: "OK", onPress: this.askPermissions}],
        {cancelable: false}
      );
    }
  }

  askPermissions = async () => {
    const { status } = await Permissions.askAsync(...types);
    if ( status !== "granted" ) {
      this.forceUpdate();
    }
  }

  render () {
    return (
      <Provider store={store}>
        <AppIndex/>
      </Provider>
    )
  }
}
