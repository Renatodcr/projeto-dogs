import React from "react";
import { useCallback } from "react";
import { useState } from "react";

const UserPost = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      fetch("https://dogsapi.origamid.dev/json/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          return json;
        });
    },
    [email, password, username]
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={({ target }) => setEmail(target.value)}
      />
      <input
        type="password"
        placeholder="senha"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <button>Enviar</button>
    </form>
  );
};

export default UserPost;
