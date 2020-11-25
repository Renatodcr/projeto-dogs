import React, { useCallback } from "react";
import styles from "./PhotoCommentsForm.module.css";
import { ReactComponent as Enviar } from "../../Assets/enviar.svg";
import useFetch from "../../Hooks/useFetch";
import Error from "../Helper/Error";
import { COMMENT_POST } from "../../api";

const PhotoCommentsForm = ({ id, setComments, single }) => {
  const [comment, setComment] = React.useState("");
  const { request, error } = useFetch();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const token = window.localStorage.getItem("token");
      const { url, options } = COMMENT_POST(id, { comment }, token);
      const { response, json } = await request(url, options);

      if (response.ok) {
        setComment("");
        setComments((comments) => [...comments, json]);
      }
    },
    [comment, id, request, setComments]
  );

  return (
    <form
      className={`${styles.form} ${single ? styles.single : " "}`}
      onSubmit={handleSubmit}
    >
      <textarea
        className={styles.textarea}
        id="comment"
        name="comment"
        placeholder="Comente..."
        value={comment}
        onChange={({ target }) => setComment(target.value)}
      />
      <button className={styles.button}>
        <Enviar />
      </button>
      <Error error={error} />
    </form>
  );
};

export default PhotoCommentsForm;
