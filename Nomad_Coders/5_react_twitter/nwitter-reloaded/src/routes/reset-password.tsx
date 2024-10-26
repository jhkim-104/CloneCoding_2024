import { useState } from "react";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  Form,
  Error,
  Wrapper,
  Title,
  Input,
  Switcher,
  Notice,
} from "../components/auth-components";

export default function login() {
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSended, setIsSended] = useState(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSended(false);
    setError("");
    if (isLoading || email === "") return;
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      console.log(e);
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
      setIsSended(true);
    }
  };

  return (
    <Wrapper>
      <Title>Reset Password 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Send Reset Email"}
        />
      </Form>
      {isSended ? (
        <Notice>
          An email has been sent.
          <br />
          Please check your inbox.
        </Notice>
      ) : null}
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Have you completed resetting your password?{" "}
        <Link to="/login">Login &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
