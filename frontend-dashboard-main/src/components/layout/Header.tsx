"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LogoutBtn } from "../LogoutButton/logoutBtn";
import styles from "./styles.module.css";
import { HelpButton } from "../HelpButton/helpBtn";
import { HelpModal } from "../helpModal/HelpModal";

export default function Header() {
  const isLoggedIn = true;
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [pageNr, setPageNr] = useState<number>(0);
  const [disabledModal, setDisabledModal] = useState<boolean>(false);
  const pathname = usePathname();

  const currentPage =
    pathname === "/dashboard"
      ? "Dashboard"
      : pathname === "/"
      ? "Hem"
      : pathname.replace("/dashboard/", "").charAt(0).toUpperCase() +
        pathname.replace("/dashboard/", "").slice(1);

  const childElements = [];
  childElements.push(LogoutBtn);

  let helpMsg = "Click here for a short guide";

  switch (currentPage) {
    case "Dashboard":
      helpMsg = "This is a dashboard view of your status";
      break;
    case "Api":
      helpMsg = "Here you can add or update your APIs";
      break;
    case "Products":
      helpMsg = "Here you can see a list and choose what products to preview";
      break;
    case "Settings":
      helpMsg =
        "Here you can customize your profile and change viewing language";
      break;
    case "Support":
      helpMsg =
        "Here you find the most asked questions, feel free to mail if you do not find answer to your question";
      break;
    default:
      helpMsg = "Go to dashboard for help modal";
  }
  useEffect(() => {
    setDisabledModal(false);
    switch (currentPage) {
      case "Dashboard":
        setPageNr(2);
        break;
      case "Api":
        setPageNr(3);
        break;
      case "Products":
        setPageNr(4);
        break;
      case "Settings":
        setDisabledModal(true);
        break;
      case "Support":
        setPageNr(5);
        break;
      default:
        setPageNr(0);
    }
  }, [currentPage]);

  return (
    <header className={styles.header}>
      <h3> {currentPage} </h3>
      <HelpButton
        onClick={() => {
          if (!disabledModal) setShowHelpModal(!showHelpModal);
          return;
        }}
        isDisabled={disabledModal}
        title={helpMsg}
      />
      {showHelpModal ? (
        <HelpModal
          pageNr={pageNr}
          isLoggedIn={isLoggedIn}
          onClick={() => {
            setShowHelpModal(!showHelpModal);
          }}
        />
      ) : null}
    </header>
  );
}
