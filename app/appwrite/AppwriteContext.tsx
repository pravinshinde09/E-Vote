import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import AppwriteService from "./service";

type AppwriteContextType = {
  appwrite: AppwriteService;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const DEFAULT_VALUE = {
  appwrite: new AppwriteService(),
  isLoggedIn: false,
  setIsLoggedIn: () => {},
};
export const AppwriteContext =
  createContext<AppwriteContextType>(DEFAULT_VALUE);

export const useAuthContext = () => useContext(AppwriteContext);

export const AppwriteContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const ctxValue = useMemo(
    () => ({
      ...DEFAULT_VALUE,
      isLoggedIn,
      setIsLoggedIn,
    }),
    [isLoggedIn, setIsLoggedIn]
  );
  return (
    <AppwriteContext.Provider value={ctxValue}>
      {children}
    </AppwriteContext.Provider>
  );
};
