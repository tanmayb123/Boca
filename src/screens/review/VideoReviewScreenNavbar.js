// @flow
import React, { Component } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Easing,
  StatusBar,
} from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';
import moment from 'moment';

import { IconButton, CameraIcon, AlbumsIcon } from '../../components';
import { ExportProgressIndicator } from './ExportProgressIndicator';
import { Units, Colors, ColorTheme } from '../../constants';

import type { Style } from '../../types';

export type VideoReviewScreenNavbarProps = {
  style?: ?Style,
  assetCreationDate: ?string,
  isVisible: boolean,
  exportProgress: number,
  onRequestPushCameraScreen: () => void,
  onRequestPushMediaExplorerScreen: () => void,
};

const styles = {
  navigationBar: {
    paddingVertical: Units.small,
    paddingHorizontal: Units.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomStyle: 'solid',
    borderBottomColor: Colors.borders.gray,
  },
  navigationBarWrap: (anim: Animated.Value) => ({
    flexDirection: 'column',
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100],
        }),
      },
    ],
  }),
  navigationBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
    backgroundColor: Colors.backgrounds.gray,
  },
  iconButton: {
    height: Units.large,
    width: Units.large,
    marginHorizontal: Units.small,
  },
  titleText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    color: ColorTheme.dark.default.components.heading.h1Text,
  },
};

const formatDate = (creationDate: ?string) => {
  return moment(creationDate).calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'ddd, DD/MM/YYYY',
  });
};

export class VideoReviewScreenNavbar extends Component<
  VideoReviewScreenNavbarProps
> {
  anim: Animated.Value;

  constructor(props: VideoReviewScreenNavbarProps) {
    super(props);
    this.anim = new Animated.Value(props.isVisible ? 0 : 1);
  }

  componentDidMount() {
    this.props.isVisible ? this.animateIn() : this.animateOut();
  }

  componentDidUpdate(prevProps: VideoReviewScreenNavbarProps) {
    if (prevProps.isVisible != this.props.isVisible) {
      this.props.isVisible ? this.animateIn() : this.animateOut();
    }
  }

  animateIn() {
    StatusBar.setHidden(false, 'slide');
    Animated.timing(this.anim, {
      duration: 150,
      toValue: 0,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  animateOut() {
    StatusBar.setHidden(true, 'slide');
    Animated.timing(this.anim, {
      duration: 150,
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <Animated.View style={styles.navigationBarWrap(this.anim)}>
        <View style={styles.navigationBar}>
          <View style={styles.navigationBarBackground} />
          <IconButton
            style={styles.iconButton}
            fillColor={Colors.icons.toolbar}
            onPress={() => {
              ReactNativeHaptic.generate('selection');
              this.props.onRequestPushCameraScreen();
            }}
            icon={CameraIcon}
          />
          <Text style={styles.titleText}>
            {this.props.assetCreationDate
              ? formatDate(this.props.assetCreationDate).toLocaleUpperCase()
              : ''}
          </Text>
          <IconButton
            style={styles.iconButton}
            fillColor={Colors.icons.toolbar}
            onPress={() => {
              ReactNativeHaptic.generate('selection');
              this.props.onRequestPushMediaExplorerScreen();
            }}
            icon={AlbumsIcon}
          />
        </View>
        <ExportProgressIndicator progress={this.props.exportProgress} />
      </Animated.View>
    );
  }
}
