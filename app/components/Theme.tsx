import React from "react";
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../context/LocalizationContext';
import { type StyleProps, useTheme } from '../context/ThemeProvider';
import { RADIUS, SPACING } from '../theme';
import Typography from './Typography';

const Theme = () => {
  const { translate } = useLanguage();
  const { colorScheme, colors, setColorScheme } = useTheme();

  const styles = getStyles({ colors })

  const toggleTheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.fields} onPress={toggleTheme}>
          <Typography variant="title04">{translate('light')}</Typography>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.fields} onPress={toggleTheme}>
          <Typography variant="title04">{translate('dark')}</Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.spacing02,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    marginTop: SPACING.spacing02,
    padding: SPACING.spacing03,
    borderRadius: RADIUS.medium,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: SPACING.spacing03,
    paddingVertical: SPACING.spacing04,
  },
  fields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 4,
  },
  divider: {
    marginVertical: SPACING.spacing02,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    width: '95%',
    alignSelf: 'center',
  },
});

export default Theme;


