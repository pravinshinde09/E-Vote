import React, { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SPACING } from "../theme";
import Button from "../components/Button";
import Typography from "../components/Typography";
import { useAuthContext } from "../appwrite/AppwriteContext";
import { type AuthStackParamList } from "../navigation/AuthScreenNavigation";
import { RouteProp } from "@react-navigation/native";
import { OtpInput } from "react-native-otp-entry";
import { useTheme } from "../context/ThemeProvider";
import { useLanguage } from "../context/LocalizationContext";

type RouteProps = RouteProp<AuthStackParamList, "VerifyOtp">;

const OTPVerification: FC<{ route: RouteProps }> = ({ route }) => {
  const { colors } = useTheme();
  const { translate } = useLanguage();
  const { setIsLoggedIn } = useAuthContext();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const { appwrite } = useAuthContext();

  const onVerify = useCallback(async () => {
    try {
      const response = await appwrite.createUserSession(
        route.params.userId,
        otp
      );
      if (response) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log("Error", error);
    }
  }, [route, otp]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleResend = async () => {
    try {
      await appwrite.resendOtp(route.params.phoneNumber);
      setTimer(30);
    } catch (error) {
      console.log("Error resending OTP:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Typography variant="title01">
        {translate('verify_otp')} {route.params.phoneNumber}
      </Typography>
      <OtpInput
        numberOfDigits={6}
        focusColor={colors.primary}
        focusStickBlinkingDuration={500}
        onTextChange={(inputText) => setOtp(inputText)}
        textInputProps={{
          accessibilityLabel: "One-Time Password",
        }}
        theme={{
          pinCodeContainerStyle: { backgroundColor: colors.card },
          pinCodeTextStyle: { color: colors.text }
        }}
      />

      <Button onPress={onVerify}>{translate('Verify_proceed')}</Button>

      {timer > 0 && (
        <Typography variant={"title04"}>
          {translate('retry_in')} {timer} {timer === 1 ? translate('second') : translate('seconds')}
        </Typography>
      )}

      {timer <= 0 && (
        <Button onPress={handleResend} variant="secondary">{translate('resend_otp')}</Button>
      )}
    </View>
  );
};

export default OTPVerification;

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.spacing03,
    paddingHorizontal: SPACING.spacing03,
    gap: SPACING.spacing03,
  },
});
