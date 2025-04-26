import api from "../index";

export const getUserByUsername = async (username, accessToken) => {
  const res = await api.get("/user/search", {
    params: { username },
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const getPublicKeyByUserId = async (userId, accessToken) => {
  const res = await api.get(`/user/public-key/${userId}`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
