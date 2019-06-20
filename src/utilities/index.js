import React from "react";
import { NetInfo } from "react-native";
import Sentry from 'sentry-expo';

async function getLocationPromise(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function getLocationAsync(options) {
  try {
    const loc = await getLocationPromise(options);
    return loc;
  } catch (e) {
    if (e.code === "E_LOCATION_TIMEOUT") {
      Sentry.captureBreadcrumb({
        message: 'Location request timed out',
        category: 'action'
      });
      console.log('timeout')
    } else {
      Sentry.captureBreadcrumb({
        message: 'Location request failed with error',
        category: 'action'
      });
      Sentry.captureException(e);
    }
    throw e;
  }
}

async function getNetStatus() {
  const info = await NetInfo.getConnectionInfo();
  if ( info.type === "none" ) {
    Sentry.captureBreadcrumb({
      message: 'Could not find a Network Connection',
      category: 'action'
    });
  }
  return info.type;
}

export {
  getLocationAsync,
  getNetStatus
}
