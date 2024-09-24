import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ScreenLockContextType {
  isScreenLockEnabled: boolean;
  toggleScreenLock: () => void;
}

const ScreenLockContext = createContext<ScreenLockContextType>({
  isScreenLockEnabled: false,
  toggleScreenLock: () => { },
});

export const useSettings = () => useContext(ScreenLockContext);

export const AppLockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScreenLockEnabled, setIsScreenLockEnabled] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const retrieveScreenLockSetting = async () => {
      try {
        const storedSetting = await AsyncStorage.getItem('isScreenLockEnabled');
        if (storedSetting !== null) {
          setIsScreenLockEnabled(storedSetting === 'true');
        }
      } catch (error) {
        console.error('Error retrieving screen lock setting:', error);
      } finally {
        setIsLoading(false);
      }
    };

    retrieveScreenLockSetting();
  }, []);

  const toggleScreenLock = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        console.error('Local Authentication is not supported on this device');
        return;
      }

      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (supportedTypes.length === 0) {
        console.error('No supported authentication types found');
        return;
      }

      const hasBiometrics = supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
        || supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);

      if (!hasBiometrics) {
        console.error('Biometric authentication is not supported on this device');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync();
      if (result.success) {
        setIsScreenLockEnabled((prev) => {
          const newValue = !prev;
          AsyncStorage.setItem('isScreenLockEnabled', String(newValue));
          return newValue;
        });
        setAuthenticated(true);
      } else {
        console.log('Authentication failed');
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Error during local authentication:', error);
      setAuthenticated(false);
    }
  };

  if (isLoading) {
    return null;
  }

  if (isScreenLockEnabled && !authenticated) {
    const authenticate = async () => {
      try {
        const result = await LocalAuthentication.authenticateAsync();
        if (result.success) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Error during local authentication:', error);
        setAuthenticated(false);
      }
    };
    authenticate();
    return null;
  }

  return (
    <ScreenLockContext.Provider value={{ isScreenLockEnabled, toggleScreenLock }}>
      {children}
    </ScreenLockContext.Provider>
  );
};
