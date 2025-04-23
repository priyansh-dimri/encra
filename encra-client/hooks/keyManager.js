import { useAuth } from "../context/useAuth";
import { decryptData } from "../utils/encryption";

export const useKeyManager = () => {
  const { setDecryptedData } = useAuth();

  const storeDerivedKeyInMemory = async (derivedKey) => {
    try {
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

  const decryptLocalStorage = async (derivedKey) => {
    try {
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
    storeDerivedKeyInMemory,
    storePrivateKeysInMemory,
    decryptLocalStorage,
  };
};
