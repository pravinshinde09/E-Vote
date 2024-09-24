import React from "react";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { languages, useLanguage } from '../../context/LocalizationContext';
import Typography from '../Typography';
import { AntDesign } from '@expo/vector-icons';
import { SPACING } from '../../theme';
import { StyleProps, useTheme } from '../../context/ThemeProvider';

const SelectLanguage = () => {
  const { locale, setLocale } = useLanguage();
  const { colors } = useTheme();
  const styles = getStyle({ colors });

  return (
    <View style={styles.container}>
      {languages.map((language) => (
        <View key={language.code}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => setLocale(language.code)}
          >
            <Typography variant={'title03'}>
              {language.name}
            </Typography>
            {locale === language.code && <AntDesign name="checkcircle" size={24} color={colors.primary} />}
          </TouchableOpacity>
          <View style={styles.divider} />
        </View>
      ))}
    </View>
  );
};


const getStyle = ({ colors }: StyleProps) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.spacing02,
    paddingHorizontal: SPACING.spacing03,
  },
  divider: {
    marginVertical: SPACING.spacing02,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    width: "95%",
    alignSelf: 'center',
    marginRight: SPACING.spacing02,
  }
});

export default SelectLanguage;
