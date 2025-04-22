import { AES, enc, SHA256 } from "crypto-js";

export const hashSharedSecret = (sharedSecret) => {
  try {
    return SHA256(sharedSecret).toString();
  } catch (error) {
    console.error("Error hashing shared secret:", error);
    throw error;
  }
};

export const encryptData = (data, key) => {
  try {
    const jsonData = JSON.stringify({ __enc__: true, payload: data });
    const encrypted = AES.encrypt(jsonData, key);
    return encrypted.toString();
  } catch (error) {
    console.error("Error encrypting data:", error);
    throw error;
  }
};

export const decryptData = (encryptedData, key) => {
  try {
    const decrypted = AES.decrypt(encryptedData, key);
    const decryptedText = decrypted.toString(enc.Utf8);

    if (!decryptedText) throw new Error("Failed to decrypt the data.");

    const parsed = JSON.parse(decryptedText);
    if (parsed && parsed.__enc__) return parsed.payload;

    return decryptedText;
  } catch (error) {
    console.error("Error decrypting data:", error);
    throw error;
  }
};
