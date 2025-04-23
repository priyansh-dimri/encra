import React, { useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    derivedKey: null,
    kyberPrivateKey: null,
    dilithiumPrivateKey: null,
    aesKeys: [],
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

  return (
    <AuthContext.Provider value={{ authData, setDecryptedData }}>
      {children}
    </AuthContext.Provider>
  );
};
