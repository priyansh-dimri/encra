import api from "../index";

export const getConversations = async (accessToken) => {
  const res = await api.get("/conversation", {
    headers: {
      "authorization": `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const startConversation = async (
  userId,
  cipherText,
  accessToken,
  csrfToken,
  signature
) => {
  const res = await api.post(
    "/conversation/start",
    {
      participantId: userId,
      encryptedAESKey: cipherText,
      signature: signature,
    },
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    }
  );
  return res.data;
};
