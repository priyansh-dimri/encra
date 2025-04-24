import api from "../index";

export const getMessages = async (
  conversationId,
  before = null,
  limit = 20
) => {
  const res = await api.get(`/messages/${conversationId}`, {
    params: before ? { before, limit } : { limit },
  });
  return res.data;
};
