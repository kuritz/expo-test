import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Home from '../../views/home';

const HomeDrawerItem = createStackNavigator({
  Home: { screen: Home },
},
  {
    headerMode: 'none'
  }
);

HomeDrawerItem.navigationOptions = {
  drawerLabel: 'Home',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="home"
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

export default HomeDrawerItem;
