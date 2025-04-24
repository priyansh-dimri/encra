import { ml_dsa87 } from "@noble/post-quantum/ml-dsa";
import { utf8ToBytes } from "@noble/post-quantum/utils";
import { encryptData } from "./encryption";
import { Buffer } from "buffer";
export const generateDilithiumKeyPair = () => {
  try {
    const { publicKey, secretKey } = ml_dsa87.keygen();
    return { publicKey, secretKey };
  } catch (error) {
    console.error("Error generating Dilithium key pair:", error);
    return null;
  }
};

export const signMessage = (message, dilithiumPrivateKey) => {
  try {
    if (!dilithiumPrivateKey) {
      throw new Error("Dilithium private key not found in memory.");
    }
    const msgBytes =
      typeof message === "string" ? utf8ToBytes(message) : message;
    const signature = ml_dsa87.sign(dilithiumPrivateKey, msgBytes);

    return Buffer.from(signature).toString("base64");
  } catch (error) {
    console.error("Error signing message:", error);
    return null;
  }
};

export const verifySignature = (message, signatureBase64, publicKey) => {
  try {
    if (!publicKey) {
      throw new Error("Public key is required for signature verification.");
    }
    const msgBytes =
      typeof message === "string" ? utf8ToBytes(message) : message;
    const signature = Uint8Array.from(Buffer.from(signatureBase64, "base64"));
    return ml_dsa87.verify(publicKey, msgBytes, signature);
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
};

export const encryptDilithiumPrivateKeyWithDerivedKey = async (
  derivedKey,
  dilithiumPrivateKey
) => {
  try {
    if (!derivedKey || !dilithiumPrivateKey) {
      throw new Error("Derived key or Dilithium private key not found.");
    }

    const encryptedPrivateKey = await encryptData(dilithiumPrivateKey, derivedKey);
    localStorage.setItem("dilithiumPrivateKey", encryptedPrivateKey);
    console.log("Dilithium private key encrypted and stored in localStorage");
  } catch (error) {
    console.error("Error encrypting Dilithium private key:", error);
  }
};
