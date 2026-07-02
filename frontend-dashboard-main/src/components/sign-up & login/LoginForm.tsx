/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { createDemoSession } from "@/utils/showcaseStorage";
import styles from "./signup-login.module.css";

interface LogInFormInput {
  email: string;
  password: string;
}

export default function LoginForm({ clicked }: any) {
  const router = useRouter();
  const authContext = useAuth();
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!authContext) {
    throw new Error("AuthContext is missing");
  }

  const { login } = authContext;
  const { register, handleSubmit } = useForm<LogInFormInput>();

  const startDemoSession = (email?: string) => {
    const user = createDemoSession(undefined, email);
    login(user, "showcase-token");
    router.push("/dashboard");
  };

  const onSubmit: SubmitHandler<LogInFormInput> = async (data) => {
    if (!serverURL) {
      startDemoSession(data.email);
      return;
    }

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
        }://${serverURL}/dashboard/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        alert("Wrong user or password");
        console.log(response);
      } else {
        const responseData = await response.json();
        login(responseData.user, responseData.token);
        localStorage.setItem("user", responseData.user.email);

        Cookies.set("userData", JSON.stringify(responseData.user));
        router.push("/dashboard");
      }
    } catch (error) {
      console.warn("No backend connection, starting showcase session.", error);
      startDemoSession(data.email);
    }
  };

  return (
    <div
      className={
        clicked
          ? `${styles.loginContainer} ${styles.register}`
          : `${styles.loginContainer}`
      }
    >
      <h2 className={styles.header}>Welcome back!</h2>
      <p className={styles.loginMsg}>
        Access your dashboard to stay connected and in control.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <p className={styles.inputLabel}>E-mail</p>
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input
              type="email"
              placeholder="Type your e-mail"
              autoComplete="off"
              required
              {...register("email", { required: true })}
              disabled={clicked ? true : false}
            />
          </label>
          <p className="validator-hint hidden">{`Enter valid email address, must include "@"`}</p>
        </fieldset>

        <fieldset>
          <p className={styles.inputLabel}>Password</p>
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              type="password"
              required
              placeholder="Type your password"
              {...register("password", { required: true })}
              disabled={clicked ? true : false}
            />
          </label>
          <p className="validator-hint hidden">
            Must be more than 8 characters, including
            <br />
            At least one number
            <br />
            At least one lowercase letter
            <br />
            At least one uppercase letter
          </p>
        </fieldset>

        <button type="submit" disabled={clicked ? true : false}>
          Sign In
        </button>
      </form>
    </div>
  );
}
