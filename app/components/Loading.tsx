import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';
import { COLORS } from '../theme';
import Typography from './Typography';

const Loading = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={COLORS.light.primary} />
      {/* <Typography variant='title03'>Loading</Typography> */}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
