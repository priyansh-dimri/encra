import { useAuth } from "../context/AuthContext";
import { ml_dsa87 } from "@noble/post-quantum/ml-dsa";
import { utf8ToBytes } from "@noble/post-quantum/utils";
import { encryptData } from "../utils/encryption";

export const useDilithiumActions = () => {
  const { authData } = useAuth();
  const { dilithiumPrivateKey } = authData;

  const generateDilithiumKeyPair = () => {
    try {
      const { publicKey, secretKey } = ml_dsa87.keygen();
      return { publicKey, secretKey };
    } catch (error) {
      console.error("Error generating Dilithium key pair:", error);
      return null;
    }
  };

  const signMessage = (message) => {
    try {
      if (!dilithiumPrivateKey) {
        throw new Error("Dilithium private key not found in memory.");
      }
      const msgBytes =
        typeof message === "string" ? utf8ToBytes(message) : message;
      return ml_dsa87.sign(dilithiumPrivateKey, msgBytes);
    } catch (error) {
      console.error("Error signing message:", error);
      return null;
    }
  };

  const verifySignature = (message, signature, publicKey) => {
    try {
      if (!publicKey) {
        throw new Error("Public key is required for signature verification.");
      }
      const msgBytes =
        typeof message === "string" ? utf8ToBytes(message) : message;
      return ml_dsa87.verify(publicKey, msgBytes, signature);
    } catch (error) {
      console.error("Error verifying signature:", error);
      return false;
    }
  };

  const encryptDilithiumPrivateKeyWithDerivedKey = () => {
    try {
      const { derivedKey, dilithiumPrivateKey } = authData;

      if (!derivedKey || !dilithiumPrivateKey) {
        throw new Error(
          "Derived key or Dilithium private key not found in memory."
        );
      }

      const encryptedPrivateKey = encryptData(dilithiumPrivateKey, derivedKey);
      localStorage.setItem("dilithiumPrivateKey", encryptedPrivateKey);
      console.log("Dilithium private key encrypted and stored in localStorage");
    } catch (error) {
      console.error("Error encrypting Dilithium private key:", error);
    }
  };

  return {
    generateDilithiumKeyPair,
    signMessage,
    verifySignature,
    encryptDilithiumPrivateKeyWithDerivedKey,
  };
};
