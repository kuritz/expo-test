import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import * as FileSystem from 'expo-file-system';

import DrawerNav from './drawer-nav';
import {
  updatePlaylist,
  setLoading,
  setUser,
  setCity
} from './redux/actions';

playlist = [
  {
    "com": "test-linens-shop",
    "name": "test-towels",
    "src": "https://s3.amazonaws.com/expo-33-test/test/pexels-photo-271711.jpeg",
    "sec": 4,
    "type": "image"
  },
  {
    "com": "test-production",
    "name": "test-bigbuck-video",
    "src": "https://s3.amazonaws.com/expo-33-test/test/big_buck_bunny.mp4",
    "sec": 28,
    "type": "video"
  },
  {
    "com": "test-photographer",
    "name": "test-photshoot",
    "src": "https://s3.amazonaws.com/expo-33-test/test/pexels-photo-320617.jpeg",
    "sec": 4,
    "type": "image"
  },
  {
    "com": "test-agency",
    "name": "test-blurry-workers",
    "src": "https://s3.amazonaws.com/expo-33-test/test/peeps-working.mp4",
    "sec": 13,
    "type": "video"
  }
]


function cacheMedia(playlist) {
  return playlist.map(async media => {
    const localUri = FileSystem.cacheDirectory + media.name
    const { exists } = await FileSystem.getInfoAsync(localUri)
    if ( !exists ) {
      return FileSystem.downloadAsync(media.src, localUri);
    }
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
})

class AppIndex extends React.Component {
  async componentDidMount() {
    await this._loadAsync();
  }

  async componentDidUpdate() {
    if ( this.props.isLoading ) {
      await this._loadAsync();
    }
  }

  async _loadAsync() {
    const { updatePlaylist, setLoading, setUser, setCity } = this.props;
    const media = cacheMedia(playlist);
    await Promise.all(media);
    setUser('demo');
    setCity('test-city');
    updatePlaylist(playlist);
    setLoading(false);
  }

  render() {
    if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return <DrawerNav />;
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.isLoading
})

const mapDispatchToProps = dispatch => {
  return {
    setLoading: bool => {
      dispatch(setLoading(bool));
    },
    updatePlaylist: playlist => {
      dispatch(updatePlaylist(playlist));
    },
    setUser: user => {
      dispatch(setUser(user));
    },
    setCity: city => {
      dispatch(setCity(city));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppIndex)
