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

export const deleteMyAccount = async (accessToken, csrfToken, password) => {
  try {
    const res = await api.delete("/user", {
      headers: {
        authorization: `Bearer ${accessToken}`,
        "x-csrf-token": csrfToken,
      },
      data: { password },
      withCredentials: true,
    });

    return res.status === 200;
  } catch (error) {
    console.error(
      "Account deletion failed:",
      error?.response?.data || error.message
    );
    return false;
  }
};
