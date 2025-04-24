import React, { useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    derivedKey: null,
    kyberPrivateKey: null,
    dilithiumPrivateKey: null,
    aesKeys: [],
    accessToken: null,
  });

  const setDecryptedData = (
    derivedKey,
    kyberPrivateKey,
    dilithiumPrivateKey,
    aesKeys
  ) => {
    setAuthData((prevData) => ({
      derivedKey: derivedKey !== null ? derivedKey : prevData.derivedKey,
      kyberPrivateKey:
        kyberPrivateKey !== null ? kyberPrivateKey : prevData.kyberPrivateKey,
      dilithiumPrivateKey:
        dilithiumPrivateKey !== null
          ? dilithiumPrivateKey
          : prevData.dilithiumPrivateKey,
      aesKeys: aesKeys !== null ? aesKeys : prevData.aesKeys,
    }));
  };

  const setTokens = (accessToken, csrfToken) => {
    setAuthData((prevData) => ({
      ...prevData,
      accessToken: accessToken ?? prevData.accessToken,
      csrfToken: csrfToken ?? prevData.csrfToken,
    }));
  };

  const clearAuthData = () => {
    setAuthData({
      derivedKey: null,
      kyberPrivateKey: null,
      dilithiumPrivateKey: null,
      aesKeys: [],
      accessToken: null,
      csrfToken: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{ authData, setDecryptedData, setTokens, clearAuthData }}
    >
      {children}
    </AuthContext.Provider>
  );
};
