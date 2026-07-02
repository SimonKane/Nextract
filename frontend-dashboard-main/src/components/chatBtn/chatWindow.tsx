"use client";
import knut from "@/public/knaut.svg";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatSession {
  id: string;
  preview: string;
}

export default function ChatWindow({
  onClose,
  sessionId,
}: {
  onClose: () => void;
  sessionId: string | null;
}) {
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

  const userId = JSON.parse(Cookies.get("userData") || "{}")?.id;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  // Load chat messages depending on sessionId
  useEffect(() => {
    if (!serverURL) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi, this is the local showcase helper. The AI backend is optional in this version.",
        },
      ]);
      return;
    }

    if (sessionId) {
      fetch(
        `${
          process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
        }://${serverURL}/dashboard/chat/session/${sessionId}`
      )
        .then((res) => res.json())
        .then((data) => {
          const safeMessages: ChatMessage[] = (data.messages || []).map(
            (m: ChatMessage) => ({
              role: m.role as ChatRole,
              content: m.content,
            })
          );
          setMessages(safeMessages);
        });
    } else {
      setMessages([{ role: "assistant", content: "Hi, how can I help you?" }]);
    }
  }, [sessionId, serverURL]);

  // Load list of sessions to update history (if needed)
  useEffect(() => {
    if (!serverURL || !userId) return;

    fetch(
      `${
        process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
      }://${serverURL}/dashboard/chat/sessions?userId=${userId}`
    )
      .then((res) => res.json())
      .then(setSessions);
  }, [userId, serverURL]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: input };
    setInput("");
    setLoading(true);

    try {
      if (!serverURL) {
        const assistantMsg: ChatMessage = {
          role: "assistant",
          content:
            "In showcase mode I can guide you through the flow: add an API, choose keys, save it, select products and preview the result. The full AI chat backend is kept in the repository for review.",
        };
        setMessages((prev) => [...prev, userMsg, assistantMsg]);
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${
          process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
        }://${serverURL}/dashboard/chat`,
        {
          message: input,
          userId,
          sessionId,
        }
      );

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: res.data.reply,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);

      // Refresh sessions list if this is a brand new session
      if (!sessionId && sessions.length === 0) {
        setTimeout(() => {
          fetch(
            `${
              process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
            }://${serverURL}/dashboard/chat/sessions?userId=${userId}`
          )
            .then((res) => res.json())
            .then(setSessions);
        }, 500);
      }
    } catch (error) {
      const errorMsg: ChatMessage = {
        role: "assistant",
        content: "⚠️ Failed to respond.",
      };
      setMessages((prev) => [...prev, userMsg, errorMsg]);
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <Image className={styles.DataKnut} src={knut} alt="DataKnut" />
        <strong>DataKnut</strong>
        <button className={styles.closebutton} onClick={onClose}>
          ✖
        </button>
      </div>

      <div className={styles.chatArea}>
        {/* Chat messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === "user" ? styles.userMsg : styles.botMsg}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className={styles.botMsg}>Typing...</div>}
      </div>

      <div className={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask something..."
        />
        <button className={styles.sendButton} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
