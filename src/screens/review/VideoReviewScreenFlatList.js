// @flow
import React, { createRef } from 'react';
import { FlatList, View, Dimensions } from 'react-native';

import { Units } from '../../constants';

import type { Element } from 'react';
import type { MediaObject } from '@jonbrennecke/react-native-media';
import type { SFC, Style, ReturnType } from '../../types';

export type VideoReviewScreenFlatListProps = {
  style?: ?Style,
  ref?: ReturnType<typeof createRef>,
  assets: Array<MediaObject>,
  onSelectAsset: (asset: MediaObject) => void,
  renderItem: (item: MediaObject) => ?Element<*>,
  onRequestLoadMore: () => void,
  onRequestDismiss: () => void,
  onSwipeDownGestureRelease: () => void,
  onSwipeDownGestureMove: (event: any, gesture: any) => void,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  videoWrap: {
    flex: 1,
    paddingVertical: Units.small,
    width: SCREEN_WIDTH,
    height: '100%',
  },
  flex: {
    flex: 1,
  },
  debugInner: {
    flex: 1,
    backgroundColor: 'red',
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const VideoReviewScreenFlatList: SFC<VideoReviewScreenFlatListProps> = ({
  ref,
  style,
  assets,
  renderItem,
  onSelectAsset,
  onRequestLoadMore,
}: VideoReviewScreenFlatListProps) => (
  <FlatList
    ref={ref}
    style={style}
    inverted
    pagingEnabled
    horizontal
    data={assets}
    keyExtractor={asset => asset.assetID}
    removeClippedSubviews
    initialNumToRender={1}
    scrollEventThrottle={16}
    indicatorStyle="white"
    snapToAlignment="center"
    directionalLockEnabled
    onScroll={({ nativeEvent }: any) => {
      if (!nativeEvent) {
        return;
      }
      const { contentOffset, layoutMeasurement } = nativeEvent;
      const index = Math.round(contentOffset.x / layoutMeasurement.width);
      if (index < assets.length) {
        onSelectAsset(assets[index]);
      }
    }}
    renderItem={({ item: asset }) => (
      <View style={styles.videoWrap}>{renderItem(asset)}</View>
    )}
    getItemLayout={(data, index) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    })}
    onEndReached={({ distanceFromEnd }) => {
      if (distanceFromEnd < 0) {
        return;
      }
      onRequestLoadMore();
    }}
    onEndReachedThreshold={0.75}
  />
);
