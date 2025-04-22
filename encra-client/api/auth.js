import api from "../api";
import { useKeyManager } from "../hooks/keyManager";
import { useKyberActions } from "../hooks/kyber";
import { useDilithiumActions } from "../hooks/dilithium";

export const useAuthActions = () => {
  const { generateDilithiumKeyPair, encryptDilithiumPrivateKeyWithDerivedKey } =
    useDilithiumActions();

  const {
    deriveKeyFromPasswordAndStoreInMemory,
    decryptLocalStorage,
    storePrivateKeysInMemory,
  } = useKeyManager();

  const { generateKyberKeyPair, encryptKyberPrivateKeyWithDerivedKey } =
    useKyberActions();

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });

    await deriveKeyFromPasswordAndStoreInMemory(password);
    await decryptLocalStorage();

    return response.data;
  };

  const register = async (username, email, password, name) => {
    await deriveKeyFromPasswordAndStoreInMemory(password);

    const { publicKey: publicKyberKey, secretKey: privateKyberKey } =
      generateKyberKeyPair();
    encryptKyberPrivateKeyWithDerivedKey();

    const { publicKey: publicDilithiumKey, secretKey: privateDilithiumKey } =
      generateDilithiumKeyPair();
    encryptDilithiumPrivateKeyWithDerivedKey();

    storePrivateKeysInMemory(privateKyberKey, privateDilithiumKey);

    const response = await api.post("/auth/register", {
      username,
      email,
      password,
      name,
      publicKyberKey,
      publicDilithiumKey,
    });

    return response.data;
  };

  return { login, register };
};
