import { useAuth } from "../context/useAuth";
import { deriveKey, initializeSalt } from "../utils/encryption";
import {
  generateKyberKeyPair,
  encryptKyberPrivateKeyWithDerivedKey,
} from "../utils/kyber";
import {
  generateDilithiumKeyPair,
  encryptDilithiumPrivateKeyWithDerivedKey,
  signMessage,
} from "../utils/dilithium";
import { loginRequest, registerRequest, logoutRequest } from "../api/auth";
import { decryptData } from "../utils/encryption";
import { Buffer } from "buffer";

export const useAuthActions = () => {
  const { setDecryptedData, setTokens, clearAuthData } = useAuth();

  const login = async (email, password) => {
    const res = await loginRequest(email, password);
    const derivedKey = await deriveKey(password);

    const encryptedAESKeys = localStorage.getItem("encryptedAESKeys");
    const encryptedKyberPrivateKey = localStorage.getItem("kyberPrivateKey");
    const encryptedDilithiumPrivateKey = localStorage.getItem(
      "dilithiumPrivateKey"
    );

    const [
      decryptedAESKeys,
      decryptedKyberPrivateKey,
      decryptedDilithiumPrivateKey,
    ] = await Promise.all([
      encryptedAESKeys ? decryptData(encryptedAESKeys, derivedKey) : null,
      encryptedKyberPrivateKey
        ? decryptData(encryptedKyberPrivateKey, derivedKey)
        : null,
      encryptedDilithiumPrivateKey
        ? decryptData(encryptedDilithiumPrivateKey, derivedKey)
        : null,
    ]);

    setDecryptedData(
      derivedKey,
      decryptedKyberPrivateKey,
      decryptedDilithiumPrivateKey,
      decryptedAESKeys
    );

    setTokens(res.data.accessToken, null);
  };

  const register = async (username, email, password, name) => {
    initializeSalt();
    const derivedKey = await deriveKey(password);

    const { publicKey: kyberPublicKey, secretKey: kyberPrivateKey } =
      generateKyberKeyPair();
    const { publicKey: dilithiumPublicKey, secretKey: dilithiumPrivateKey } =
      generateDilithiumKeyPair();

    const kyberPublicKeySignature = signMessage(
      kyberPublicKey,
      dilithiumPrivateKey
    );

    await encryptKyberPrivateKeyWithDerivedKey(derivedKey, kyberPrivateKey);
    await encryptDilithiumPrivateKeyWithDerivedKey(
      derivedKey,
      dilithiumPrivateKey
    );

    const res = await registerRequest({
      username,
      email,
      password,
      name,
      kyberPublicKey: Buffer.from(kyberPublicKey).toString("base64"),
      dilithiumPublicKey: Buffer.from(dilithiumPublicKey).toString("base64"),
      kyberPublicKeySignature,
    });

    setDecryptedData(derivedKey, kyberPrivateKey, dilithiumPrivateKey, null);
    setTokens(res.data.accessToken, null);
  };

  const logout = async () => {
    try {
      await logoutRequest();
      clearAuthData();
    } catch (err) {
      console.error("Logout failed: ", err);
    }
  };

  return { login, register, logout };
};
