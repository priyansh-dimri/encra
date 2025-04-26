import api from "../index";

export const getConversations = async (accessToken) => {
  const res = await api.get("/conversation", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
