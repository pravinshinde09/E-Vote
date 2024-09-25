import React, { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { RADIUS } from "../theme";
import { StyleProps, useTheme } from "../context/ThemeProvider";

type Variants = "primary" | "secondary" | "button01" | "button02" | "button03" | "link";

type Props = {
  variant?: Variants;
  onPress: () => void;
  children: ReactNode;
  fullwidth?: boolean;
  disabled?: boolean; 
};

export default function Button({
  variant = "primary",
  onPress,
  children,
  fullwidth = false,
  disabled = false, 
}: Props) {
  const { colors } = useTheme();

  const textStyles = getTextStyles({ colors });
  const btnStyles = getBtnStyles({ colors });

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress} 
      style={[
        btnStyles.btn,
        btnStyles[variant],
        fullwidth && btnStyles.fullwidth,
        disabled && btnStyles.disabled,
      ]}
      disabled={disabled} 
    >
      <Text style={[textStyles.text, textStyles[variant], disabled && textStyles.disabled]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const getTextStyles = ({ colors }: StyleProps) =>
  StyleSheet.create({
    text: {
      fontSize: 16,
      fontWeight: "500",
    },
    primary: {
      color: colors.white,
    },
    secondary: {
      color: colors.primary,
    },
    button01: {
      color: colors.green,
    },
    button02: {
      color: colors.gray200,
    },
    button03: {
      color: colors.primary50,
    },
    link: {},
    disabled: {
      color: colors.gray,
    },
  });

const getBtnStyles = ({ colors }: StyleProps) =>
  StyleSheet.create({
    fullwidth: {
      width: "100%",
    },
    btn: {
      borderWidth: 1,
      borderRadius: RADIUS.medium,
      paddingVertical: 6,
      paddingHorizontal: 14,
      alignItems: "center",
    },
    primary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.white,
      borderColor: colors.primary,
    },
    button01: {
      backgroundColor: colors.white,
      borderColor: colors.green,
    },
    button02: {
      backgroundColor: colors.white,
      borderColor: colors.gray200,
    },
    button03: {
      backgroundColor: colors.white,
      borderColor: colors.primary50,
    },
    link: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    disabled: {
      backgroundColor: colors.gray200,
      borderColor: colors.gray,
    },
  });
