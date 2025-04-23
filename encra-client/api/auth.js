import api from "../api";
import { useKeyManager } from "../hooks/keyManager";
import {
  encryptKyberPrivateKeyWithDerivedKey,
  generateKyberKeyPair,
} from "../utils/kyber";
import {
  encryptDilithiumPrivateKeyWithDerivedKey,
  generateDilithiumKeyPair,
  signMessage,
} from "../utils/dilithium";
import { deriveKey, initializeSalt } from "../utils/encryption";
import { Buffer } from "buffer";

export const useAuthActions = () => {
  const {
    decryptLocalStorage,
    storePrivateKeysInMemory,
    storeDerivedKeyInMemory,
  } = useKeyManager();

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });

    const derivedKey = await deriveKey(password);
    await decryptLocalStorage(derivedKey);

    storeDerivedKeyInMemory(derivedKey);

    return response.data;
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

    storePrivateKeysInMemory(kyberPrivateKey, dilithiumPrivateKey);

    await encryptKyberPrivateKeyWithDerivedKey(derivedKey, kyberPrivateKey);
    await encryptDilithiumPrivateKeyWithDerivedKey(
      derivedKey,
      dilithiumPrivateKey
    );

    const publicKyberKeyStr = Buffer.from(kyberPublicKey).toString("base64");
    const publicDilithiumKeyStr =
      Buffer.from(dilithiumPublicKey).toString("base64");

    const response = await api.post("/auth/register", {
      username,
      email,
      password,
      name,
      kyberPublicKey: publicKyberKeyStr,
      dilithiumPublicKey: publicDilithiumKeyStr,
      kyberPublicKeySignature,
    });

    storeDerivedKeyInMemory(derivedKey);

    return response.data;
  };

  return { login, register };
};
