import React, { useCallback, useEffect, useState } from "react";
import useFetch from "../../Hooks/useFetch";
import useForm from "../../Hooks/useForm";
import Button from "../Forms/Button";
import Input from "../Forms/Input";
import { PASSWORD_RESET } from "../../api";
import Error from "../Helper/Error";
import { useNavigate } from "react-router-dom";
import Head from "../Helper/Head";

const LoginPasswordReset = () => {
  const [login, setLogin] = useState("");
  const [key, setKey] = useState("");
  const password = useForm();
  const { loading, error, request } = useFetch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");
    const login = params.get("login");
    if (key) setKey(key);
    if (login) setLogin(login);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (password.validate()) {
        const { url, options } = PASSWORD_RESET({
          login,
          key,
          password: password.value,
        });
        const { response } = await request(url, options);
        if (response.ok) navigate("/login");
      }
    },
    [key, login, navigate, password, request]
  );

  return (
    <section className="animeLeft">
      <Head title="Resete a Senha" />
      <h1 className="title">Resete a Senha</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Nova Senha"
          type="password"
          name="password"
          {...password}
        />
        {loading ? (
          <Button disabled>Resetando...</Button>
        ) : (
          <Button>Resetar</Button>
        )}
      </form>
      <Error error={error} />
    </section>
  );
};

export default LoginPasswordReset;
