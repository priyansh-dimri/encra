import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import api from "../api";

export const useSetupCSRF = () => {
  const { authData, setTokens } = useAuth();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fetchCSRF = async () => {
      try {
        const res = await api.get("/auth/csrf-token", {
          withCredentials: true,
        });
        setTokens(null, res.data.csrfToken);
        setDone(true);
      } catch (err) {
        console.error("Failed to get CSRF token:", err);
      }
    };

    if (!authData.csrfToken) {
      fetchCSRF();
    } else {
      setDone(true);
    }
  }, [authData.csrfToken, setTokens]);

  return done;
};
