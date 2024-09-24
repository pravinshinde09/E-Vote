import React, { FC } from "react";
import {
  Text,
  TextInput,
  View,
  TextInputProps,
  StyleSheet,
} from "react-native";
import { RADIUS, SPACING } from "../theme";
import { StyleProps, useTheme } from "../context/ThemeProvider";

interface InputProps extends TextInputProps {
  label?: string;
}

const Input: FC<InputProps> = ({ label, ...rest }) => {
  const { colors } = useTheme()
  const styles = getStyles({ colors })
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...rest} style={styles.inputContainer} multiline />
    </View>
  );
};

export default Input;

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
  container: {
    marginVertical: SPACING.spacing01
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    marginBottom: SPACING.spacing02,
    textTransform: 'capitalize'
  },
  inputContainer: {
    width: "100%",
    minHeight: 40,
    borderWidth: 1,
    fontSize: 16,
    color: colors.text,
    borderRadius: RADIUS.small,
    paddingHorizontal: SPACING.spacing02,
    borderColor: colors.gray100,
    paddingLeft: SPACING.spacing03,
    backgroundColor: colors.inputBox
  }
});
