import { useAuth } from "../context/AuthContext";
import { encryptData } from "../utils/encryption";
import { ml_kem1024 } from "@noble/post-quantum/ml-kem";

export const useKyberActions = () => {
  const { authData } = useAuth();

  const generateKyberKeyPair = () => {
    try {
      const { publicKey, secretKey } = ml_kem1024.keygen();
      return { publicKey, secretKey };
    } catch (error) {
      console.error("Error generating Kyber key pair:", error);
      return null;
    }
  };

  const encryptKyberPrivateKeyWithDerivedKey = () => {
    try {
      const { derivedKey, kyberPrivateKey } = authData;

      if (!derivedKey || !kyberPrivateKey) {
        throw new Error(
          "Derived key or Kyber private key not found in memory."
        );
      }

      const encryptedPrivateKey = encryptData(kyberPrivateKey, derivedKey);
      localStorage.setItem("kyberPrivateKey", encryptedPrivateKey);
      console.log("Kyber private key encrypted and stored in localStorage");
    } catch (error) {
      console.error("Error encrypting Kyber private key:", error);
    }
  };

  const encapsulateSharedSecretWithPublicKey = (publicKey) => {
    try {
      const { ciphertext, sharedSecret } = ml_kem1024.encapsulate(publicKey);
      return { ciphertext, sharedSecret };
    } catch (error) {
      console.error("Error encrypting with Kyber public key:", error);
      return null;
    }
  };

  const decapsulateSharedSecret = (cipherText) => {
    try {
      const { kyberPrivateKey } = authData;

      if (!kyberPrivateKey) {
        throw new Error("Kyber private key not found in memory.");
      }

      const sharedSecret = ml_kem1024.decapsulate(cipherText, kyberPrivateKey);
      return sharedSecret;
    } catch (error) {
      console.error("Error decapsulating shared secret:", error);
      return null;
    }
  };

  return {
    generateKyberKeyPair,
    encapsulateSharedSecretWithPublicKey,
    decapsulateSharedSecret,
    encryptKyberPrivateKeyWithDerivedKey,
  };
};
