import api from "../index";

export const fetchAESKey = async (
  conversationId,
  accessToken,
  csrfToken,
) => {
    console.log("HERE");
  const res = await api.delete(
    `/key/${conversationId}`,
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
