// @flow
import React from 'react';
import { SafeAreaView } from 'react-native';

import {
  CameraCapture,
  CameraSettingIdentifiers,
} from '@jonbrennecke/react-native-camera';

import { wrapWithCameraScreenState } from './cameraScreenState';
import { CameraScreenOnboarding } from './CameraScreenOnboarding';
import { CameraFormatModal } from '../../components';

import type { ComponentType } from 'react';

import type { Style } from '../../types';

export type CameraScreenProps = {
  style?: ?Style,
};

const styles = {
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const CameraScreen: ComponentType<
  CameraScreenProps
> = wrapWithCameraScreenState(
  ({
    style,
    cameraRef,
    isFormatModalVisible,
    isDepthPreviewEnabled,
    stopCapture,
    startCapture,
    iso,
    format,
    updateFormat,
    supportedFormats,
    supportedISORange,
    updateISO,
    supportedExposureRange,
    exposure,
    updateExposure,
    activeCameraSetting,
    setActiveCameraSetting,
    hasCameraPermissions,
    requestCameraPermissions,
    presentCameraFormatModal,
    dismissCameraFormatModal,
    enableDepthPreview,
    disableDepthPreview,
  }) => (
    <SafeAreaView style={[styles.container, style]}>
      <CameraScreenOnboarding
        hasCameraPermissions={hasCameraPermissions}
        onRequestCameraPermissions={requestCameraPermissions}
      >
        <CameraCapture
          style={styles.flex}
          cameraRef={cameraRef}
          cameraSettings={{
            [CameraSettingIdentifiers.ISO]: {
              currentValue: iso,
              supportedRange: supportedISORange,
            },
            [CameraSettingIdentifiers.Exposure]: {
              currentValue: exposure,
              supportedRange: supportedExposureRange,
            },
            [CameraSettingIdentifiers.ShutterSpeed]: {
              currentValue: exposure,
              supportedRange: supportedExposureRange,
            }, // TODO
            [CameraSettingIdentifiers.Focus]: {
              currentValue: exposure,
              supportedRange: supportedExposureRange,
            }, // TODO
            [CameraSettingIdentifiers.WhiteBalance]: {
              currentValue: exposure,
              supportedRange: supportedExposureRange,
            }, // TODO
          }}
          cameraLayoutStyle="fullscreen"
          enableDepthPreview={isDepthPreviewEnabled}
          supportedISORange={supportedISORange}
          activeCameraSetting={activeCameraSetting}
          onRequestBeginCapture={startCapture}
          onRequestEndCapture={() =>
            stopCapture({
              saveToCameraRoll: true,
            })
          }
          onRequestFocus={point => {
            if (cameraRef && cameraRef.current) {
              cameraRef.current.focusOnPoint(point);
            }
          }}
          onRequestChangeISO={updateISO}
          onRequestChangeExposure={updateExposure}
          onRequestSelectActiveCameraSetting={setActiveCameraSetting}
          onRequestShowFormatDialog={presentCameraFormatModal}
          onRequestToggleDepthPreview={
            isDepthPreviewEnabled ? disableDepthPreview : enableDepthPreview
          }
        />
      </CameraScreenOnboarding>
      <CameraFormatModal
        activeFormat={format}
        supportedFormats={supportedFormats}
        isVisible={isFormatModalVisible}
        onRequestDismissModal={dismissCameraFormatModal}
        onRequestUpdateFormat={updateFormat}
      />
    </SafeAreaView>
  )
);
