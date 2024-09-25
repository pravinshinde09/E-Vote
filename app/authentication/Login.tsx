import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import PhoneInput from "react-native-phone-number-input";
import { RADIUS, SPACING } from "../theme";
import Button from "../components/Button";
import { AuthStackParamList } from "../navigation/AuthScreenNavigation";
import Typography from "../components/Typography";
import { useAuthContext } from "../appwrite/AppwriteContext";
import { StyleProps, useTheme } from "../context/ThemeProvider";
import { useLanguage } from "../context/LocalizationContext";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Login = () => {
  const { colors } = useTheme();
  const { translate } = useLanguage();
  const { appwrite } = useAuthContext();
  const [phoneInputValue, setPhoneInputValue] = useState({
    countryCode: "",
    phoneNumber: "",
  });
  const phoneInput = useRef<PhoneInput>(null);

  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const onLogin = useCallback(async () => {
    try {
      const response = await appwrite.loginPhoneNumber({
        phoneNumber: `+${phoneInputValue.countryCode}${phoneInputValue.phoneNumber}`,
      });
      if (response?.userId) {
        navigation.navigate("VerifyOtp", {
          userId: response.userId,
          phoneNumber: `+${phoneInputValue.countryCode}${phoneInputValue.phoneNumber}`,
        });
      }
    } catch (error) {
      console.log("Error", error);
    }
  }, [phoneInputValue]);

  const styles = getStyles({ colors });
  return (
    <View style={styles.container}>
      <Typography variant="title02">{translate('enter_mobile_number')}</Typography>
      <PhoneInput
        ref={phoneInput}
        defaultValue={phoneInputValue.phoneNumber}
        defaultCode="US"
        layout="first"
        placeholder="Enter your phone number"
        onChangeText={(text) => {
          setPhoneInputValue((prevState) => ({
            ...prevState,
            phoneNumber: text,
          }));
        }}
        onChangeCountry={(country) => {
          setPhoneInputValue((prevState) => ({
            ...prevState,
            countryCode: country.callingCode[0],
          }));
        }}
        withDarkTheme
        autoFocus
        containerStyle={styles.phoneInputContainer}
        codeTextStyle={{ color: colors.text }}
        textContainerStyle={{ backgroundColor: colors.card }}
        textInputStyle={{ color: colors.text }}
        textInputProps={{
          placeholderTextColor: colors.gray100,
          style: { color: colors.text }
        }}
        renderDropdownImage={
          <MaterialIcons name="arrow-drop-down" size={24} color={colors.icon} />
        }
      />
      <Button onPress={onLogin}>{translate('get_otp')}</Button>
    </View>
  );
};

export default Login;

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
  container: {
    marginTop: SPACING.spacing07,
    paddingHorizontal: SPACING.spacing03,
    paddingVertical: SPACING.spacing02,
    gap: SPACING.spacing03,
  },
  checkBoxStyling: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: SPACING.spacing03,
  },
  phoneInputContainer: {
    borderWidth: 1,
    borderColor: colors.gray,
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: RADIUS.small,
    padding: 2
  }
});
