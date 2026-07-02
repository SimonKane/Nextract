/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { createDemoSession } from "@/utils/showcaseStorage";
import styles from "./signup-login.module.css";

interface SignupFormInput {
  email: string;
  password: string;
  company: string;
}

export default function SignupForm({ clicked }: any) {
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;
  const router = useRouter();

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { register, handleSubmit } = useForm<SignupFormInput>();

  const startDemoAccount = (data: SignupFormInput) => {
    const user = createDemoSession(data.company, data.email);
    Cookies.set("token", "showcase-token", { expires: 1 });
    Cookies.set("userData", JSON.stringify(user), { expires: 1 });
    setShowSuccessModal(true);
    setTimeout(() => router.push("/dashboard"), 900);
  };

  const onSubmit: SubmitHandler<SignupFormInput> = async (data) => {
    if (!serverURL) {
      startDemoAccount(data);
      return;
    }

    try {
      /* Här vi fetchar från vår backend sen. */
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
        }://${serverURL}/dashboard/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        setShowSuccessModal(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Could not fetch from server");
      }
    } catch (error) {
      console.warn("No backend connection, creating showcase account.", error);
      startDemoAccount(data);
    }
  };

  return (
    <>
      {showSuccessModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Thank you for joining!</h3>
            <p>You will be redirected to the login page shortly...</p>
          </div>
        </div>
      )}
      <div
        className={
          clicked
            ? `${styles.signupContainer} ${styles.register}`
            : `${styles.signupContainer}`
        }
      >
        <h2 className={`${styles.header} ${styles.signup}`}>
          Create your account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <p className={styles.inputLabel}>Business name</p>
            <label className="input validator">
              <svg
                className="h-[1em] opacity-50"
                fill="#000000"
                viewBox="-2 0 16 16"
                id="company-16px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g strokeWidth="0"></g>
                <g strokeLinecap="round" strokeLinejoin="round"></g>
                <g>
                  {" "}
                  <path
                    id="Path_133"
                    data-name="Path 133"
                    d="M323.5-192h-9a1.5,1.5,0,0,0-1.5,1.5V-176h12v-14.5A1.5,1.5,0,0,0,323.5-192ZM318-177v-3h2v3Zm6,0h-3v-3.5a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5v3.5h-3v-13.5a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5Zm-8-12h2v2h-2Zm4,0h2v2h-2Zm-4,4h2v2h-2Zm4,0h2v2h-2Z"
                    transform="translate(-313 192)"
                  ></path>{" "}
                </g>
              </svg>
              <input
                type="text"
                placeholder="Type your business name"
                autoComplete="off"
                required
                {...register("company", { required: true })}
                disabled={clicked ? false : true}
              />
            </label>
            <p className="validator-hint hidden">
              Must be more than 4 characters
            </p>
          </fieldset>

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
                disabled={clicked ? false : true}
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
                  <circle
                    cx="16.5"
                    cy="7.5"
                    r=".5"
                    fill="currentColor"
                  ></circle>
                </g>
              </svg>
              <input
                disabled={clicked ? false : true}
                type="password"
                autoComplete="off"
                required
                placeholder="Password"
                {...register("password", { required: true })}
                minLength={8}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              />
            </label>
            <p className={`${styles.forgot} ${styles.signup}`}>
              Must be 8 characters at least
            </p>
            <p className="validator-hint hidden">
              Must also include:
              <br />
              At least one number
              <br />
              At least one lowercase letter
              <br />
              At least one uppercase letter
            </p>

            <p className={`${styles.forgot} ${styles.terms}`}>
              <input className={styles.checkbox} type="checkbox" /> By creating
              an account means you agree to the Terms and Conditions, and our
              Privacy Policy
            </p>
          </fieldset>

          <button type="submit" disabled={clicked ? false : true}>
            Sign Up
          </button>
        </form>
        {/*       <p className="signup-login-redirect">
          Already have an account?{" "}
          <Link href="/" className="underline">
            Click here
          </Link>
        </p> */}
      </div>
    </>
  );
}
