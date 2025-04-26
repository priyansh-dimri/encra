import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { fetchCsrfToken } from "../api/auth";

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    derivedKey: null,
    kyberPrivateKey: null,
    dilithiumPrivateKey: null,
    aesKeys: [],
    accessToken: null,
    csrfToken: null,
  });

  const setDecryptedData = (
    derivedKey,
    kyberPrivateKey,
    dilithiumPrivateKey,
    aesKeys
  ) => {
    setAuthData((prevData) => ({
      ...prevData,
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

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchCsrfToken();
        setTokens(null, data.csrfToken);
      } catch (err) {
        console.error("CSRF Token fetch failed: ", err);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{ authData, setDecryptedData, setTokens, clearAuthData }}
    >
      {children}
    </AuthContext.Provider>
  );
};
