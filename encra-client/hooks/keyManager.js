import { useAuth } from "../context/AuthContext";
import argon2 from "argon2-browser";
import { decryptData } from "../utils/encryption";

export const useKeyManager = () => {
  const { setDecryptedData, authData } = useAuth();

  const deriveKeyFromPasswordAndStoreInMemory = async (password) => {
    try {
      const derivedKey = await argon2.hash({
        pass: password,
        timeCost: 3,
        memoryCost: 2 ** 16,
        parallelism: 1,
        hashLength: 32,
      });

      setDecryptedData(derivedKey, null, null, null);

      console.log("Key derived and stored in memory");
    } catch (error) {
      console.error("Error deriving key: ", error);
    }
  };

  const storePrivateKeysInMemory = (kyberPrivateKey, dilithiumPrivateKey) => {
    try {
      setDecryptedData(null, kyberPrivateKey, dilithiumPrivateKey, null);

      console.log("Private keys stored in memory");
    } catch (error) {
      console.error("Error storing private keys in memory: ", error);
    }
  };

  const decryptLocalStorage = async () => {
    try {
      const { derivedKey } = authData;

      if (!derivedKey) {
        throw new Error("No derived key found in memory.");
      }

      const encryptedAESKeys = localStorage.getItem("encryptedAESKeys");
      const encryptedKyberPrivateKey = localStorage.getItem("kyberPrivateKey");
      const encryptedDilithiumPrivateKey = localStorage.getItem(
        "dilithiumPrivateKey"
      );

      let decryptedAESKeys = null;
      let decryptedKyberPrivateKey = null;
      let decryptedDilithiumPrivateKey = null;

      if (encryptedAESKeys) {
        decryptedAESKeys = await decryptData(encryptedAESKeys, derivedKey);
      }

      if (encryptedKyberPrivateKey) {
        decryptedKyberPrivateKey = await decryptData(
          encryptedKyberPrivateKey,
          derivedKey
        );
      }

      if (encryptedDilithiumPrivateKey) {
        decryptedDilithiumPrivateKey = await decryptData(
          encryptedDilithiumPrivateKey,
          derivedKey
        );
      }

      setDecryptedData(
        null,
        decryptedKyberPrivateKey,
        decryptedDilithiumPrivateKey,
        decryptedAESKeys
      );

      console.log("Available data decrypted and stored in memory");
    } catch (error) {
      console.error("Error decrypting localStorage: ", error);
    }
  };

  return {
    deriveKeyFromPasswordAndStoreInMemory,
    storePrivateKeysInMemory,
    decryptLocalStorage,
  };
};
