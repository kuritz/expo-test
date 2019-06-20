import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Image,
  StyleSheet,
  View
} from "react-native";
import {
  ScreenOrientation,
  Video,
  KeepAwake,
  FileSystem,
  Camera,
  FaceDetector
} from "expo";
import Sentry from 'sentry-expo';

import {
  getLocationAsync,
  getNetStatus,
} from '../utilities'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  image: {
    flex: 1,
    resizeMode: 'contain'
  },
  video: {
    flex: 1
  },
  camera: {
    flex: 1,
    position: 'absolute',
    width: 1,
    height: 1,
    bottom: -5,
    right: -5
  }
});

class Media extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistIndex: 0,
      camera: true,
    };
    this._mounted = false;
    this.locTimeout = 5000;
    this.events = [];
    this.networkType = "none";
    this.nextChange;
    // Camera
    this.lastFace;
    this.cameraIntervalMillis = 180000;
  }

  async componentDidMount() {
    this._mounted = true;
    KeepAwake.activate();
    await ScreenOrientation.allowAsync(ScreenOrientation.Orientation.LANDSCAPE);

    await Promise.all([
      this._updateNetStatus(),
      this._updateLocation()
    ]);
    this._setNextMediaChange(this.state.playlistIndex);
  }

  async componentDidUpdate(_, prevState) {
    if ( prevState.playlistIndex !== this.state.playlistIndex ) {
      this._setNextMediaChange(this.state.playlistIndex);
    }
    if ( !prevState.camera && !this.state.camera ) {
      this._handleCamera();
    }
    this._updateLocation();
  }

  async componentWillUnmount() {
    clearTimeout(this.nextChange);
    this._mounted = false;
    KeepAwake.deactivate();
    await ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);
  }

  async _updateLocation() {
    this.loc = await getLocationAsync({
      enableHighAccuracy: true, timeout: this.locTimeout, maximumAge: 30000
    });
  }

  async _updateNetStatus() {
    this.networkType = await getNetStatus();
  }

  _getCurrMedia() {
    return this.props.playlist[this.state.playlistIndex];
  }

  _getNextIndex() {
    const { playlist } = this.props;
    const { playlistIndex } = this.state;
    return playlistIndex === playlist.length - 1 ? 0 : playlistIndex + 1;
  }

  _setNextMediaChange() {
    const nextIndex = this._getNextIndex();
    this.nextChange = setTimeout( () => this._handleMediaChange(nextIndex),
      this._getCurrMedia()['sec'] * 1000
    );
  }

  _handleMediaChange(nextIndex) {
    this._mounted && this.setState({
      playlistIndex: nextIndex,
    });
  }

  _handleCamera() {
    if ( (new Date).getTime() - this.lastFace.getTime() > this.cameraIntervalMillis ) {
      console.log("enabling camera")
      this._mounted && this.setState({ camera: true })
    }
  }

  _handleFaceDetected() {
    this.lastFace = new Date;
    console.log('detected face, disabling')
    this._mounted && this.setState({ camera: false })
  }

  _onFacesDetected = ({ faces }) => {
    if ( this.state.camera && faces.length !== 0 ) {
      this._handleFaceDetected();
    }
  };

  _onFaceDetectionError = (e) => {
    Sentry.captureBreadcrumb({
      message: 'face detection error',
      category: 'action'
    });
    Sentry.captureException(e);
  };

  render() {
    const { camera } = this.state;
    const currMedia = this._getCurrMedia();
    const video = currMedia["type"] === "video" ? true : false;

    return (
      <View style={styles.container}>
        { video ? (
          <Video
            source={{ uri: FileSystem.cacheDirectory + currMedia.name }}
            rate={1.0}
            volume={0.5}
            isMuted={true}
            resizeMode="contain"
            shouldPlay={true}
            isLooping={true}
            style={styles.video}
          />
        ) : (
          <Image
            style={styles.image}
            source={{ uri: FileSystem.cacheDirectory + currMedia.name }}
          />
        )}
        { camera &&
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.front}
            onFacesDetected={this._onFacesDetected}
            onFaceDetectionError={this._onFaceDetectionError}
            faceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.accurate,
              detectLandmarks: FaceDetector.Constants.Mode.none,
              runClassifications: FaceDetector.Constants.Mode.none,
            }}
          />
        }
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  playlist: state.playlist,
  user: state.user,
  city: state.city
})

export default connect(mapStateToProps)(Media)
