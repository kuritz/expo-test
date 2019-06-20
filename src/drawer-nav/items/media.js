import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Media from '../../views/media';

const MediaDrawerItem = createStackNavigator({
  Media: { screen: Media }
},
  {
    headerMode: 'none'
  }
);

MediaDrawerItem.navigationOptions = {
  drawerLabel: 'Media',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="image"
      size={30}
      iconStyle={{
        width: 30,
        height: 30
      }}
      type="material"
      color={tintColor}
    />
  ),
};

export default MediaDrawerItem;
