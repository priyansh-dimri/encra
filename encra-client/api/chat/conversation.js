import api from "../index";

export const getConversations = async () => {
  const res = await api.get("/conversations");
  return res.data;
};
