import React from 'react';
import { createDrawerNavigator } from 'react-navigation';
import { Dimensions } from 'react-native';

import Home from './items/home';
import Media from './items/media';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default DrawerNav = createDrawerNavigator(
  {
    Home: {
      path: '/home',
      screen: Home,
    },
    Media: {
      path: '/media',
      screen: Media,
    }
  },
  {
    initialRouteName: 'Home',
    contentOptions: {
      labelStyle: {
        fontSize: 15,
        marginLeft: 0,
      },
    },
    drawerWidth: SCREEN_WIDTH * 0.5,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
  }
);
