import api from "../index";

export const getMessages = async (
  accessToken,
  conversationId,
  before = null
) => {
  try {
    const res = await api.get(`/message/${conversationId}`, {
      params: before ? { before } : {},
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error in getMessages:", error);
    return null;
  }
};
