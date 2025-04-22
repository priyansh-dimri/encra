import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
