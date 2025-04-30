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

export const deleteMessage = async (
  accessToken,
  csrfToken,
  messageId,
  conversationId
) => {
  try {
    const res = await api.delete(`/message/${messageId}`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        "x-csrf-token": csrfToken,
      },
      data: {
        conversationId,
      },
    });
    console.log("Message deleted:", res.data);
    return true;
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    return false;
  }
};
