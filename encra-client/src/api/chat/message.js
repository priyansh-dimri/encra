import api from "../index";

export const getMessages = async (
  accessToken,
  conversationId,
  before = null,
) => {
  const res = await api.get(`/message/${conversationId}`, {
    params: before ? before : null,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
