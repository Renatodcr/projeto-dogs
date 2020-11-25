import React, { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TOKEN_POST, TOKEN_VALIDATE_POST, USER_GET } from "./api";

export const UserContext = createContext();

export const UserStorage = ({ children }) => {
  const [data, setData] = useState(null);
  const [login, setLogin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getUser = useCallback(async (token) => {
    const { url, options } = USER_GET(token);
    const response = await fetch(url, options);
    const json = await response.json();
    setData(json);
    setLogin(true);
  }, []);

  const userLogin = useCallback(
    async (username, password) => {
      try {
        setError(null);
        setLoading(true);
        const { url, options } = TOKEN_POST({ username, password });
        const tokenRes = await fetch(url, options);
        if (!tokenRes.ok) throw new Error("Erro: Usuário Inválido");
        const { token } = await tokenRes.json();
        window.localStorage.setItem("token", token);
        await getUser(token);
        navigate("/conta");
      } catch (err) {
        setError(err.message);
        setLogin(false);
      } finally {
        setLoading(false);
      }
    },
    [getUser, navigate]
  );

  const userLogout = useCallback(async () => {
    setData(null);
    setError(null);
    setLoading(false);
    setLogin(false);
    window.localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    async function autoLogin() {
      const token = window.localStorage.getItem("token");
      if (token) {
        try {
          setError(null);
          setLoading(true);
          const { url, options } = TOKEN_VALIDATE_POST(token);
          const response = await fetch(url, options);
          if (!response.ok) throw new Error("Token Inválido");
          await getUser(token);
        } catch (err) {
          userLogout();
        } finally {
          setLoading(false);
        }
      } else {
        setLogin(false);
      }
    }
    autoLogin();
  }, [getUser, userLogout]);

  return (
    <UserContext.Provider
      value={{ userLogin, data, userLogout, error, loading, login }}
    >
      {children}
    </UserContext.Provider>
  );
};
