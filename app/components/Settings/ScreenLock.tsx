import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch } from 'react-native';
import { useSettings } from '../../context/ScreenLockContext';
import Typography from '../Typography';
import { SPACING } from '../../theme';
import { useTheme } from '../../context/ThemeProvider';

const ScreenLockSwitch: React.FC = () => {
  const { isScreenLockEnabled, toggleScreenLock } = useSettings();
  const { colors } = useTheme()

  return (
    <View style={styles.container}>
      <Typography variant={'title03'}>Enable Screen Lock</Typography>
      <Switch
        trackColor={{ false: colors.gray100, true: colors.primary200 }}
        thumbColor={isScreenLockEnabled ? colors.primary : colors.gray}
        ios_backgroundColor="#3e3e3e"
        value={isScreenLockEnabled}
        onValueChange={toggleScreenLock}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.spacing03,
    justifyContent: 'space-between'
  }
});

export default ScreenLockSwitch

