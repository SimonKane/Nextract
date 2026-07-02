"use client";
import { JsonViewer } from "@/components/apiComponents/JsonView";
import LoadingCircleSpinner from "@/components/loadingSpinner/LoadingSpinner";
import tickCircle from "@/public/tick-circle.svg";
import Cookies from "js-cookie";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  useAPIKeyStore,
  useApiIdStore,
  useOriginalAPIStore,
} from "@/lib/store";
import {
  deleteShowcaseApi,
  getShowcaseApis,
} from "@/utils/showcaseStorage";
import Link from "next/link";
import styles from "./styles.module.css";

const ChatWindow = dynamic(() => import("@/components/chatBtn/chatWindow"), {
  ssr: false,
});

interface Api {
  id: string;
  items: object[];
  APIname: string;
  name?: string;
  originalApi: {
    apiUrl: string;
  };
  type: "created" | "updated";
  date: string;
}

interface DataItem {
  items?: object[];
}

interface DataObject {
  id: string;
  item?: object;
  originalApi: {
    apiUrl: string;
  };
}

interface ChatSession {
  id: string;
  preview: string;
}

export default function Dashboard() {
  const [name, setName] = useState<string>("you whitout a name");
  const [apiList, setApiList] = useState<Api[]>([]);
  const [productCount, setProductCount] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [activeAPI, setActiveAPI] = useState<Api | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recentActivities, setRecentActivities] = useState<Api[]>([]);

  // Chat
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const userId = Cookies.get("userData");
  //let APIKey = useAPIKeyStore((state) => state.key);

  const setApiId = useApiIdStore((state) => state.setId);
  const setApi = useOriginalAPIStore((state) => state.setApi);
  const setAPIkey = useAPIKeyStore((state) => state.setKey);

  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));

  const router = useRouter();
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchApis = useCallback(() => {
    const rawCookie = Cookies.get("userData");
    if (!serverURL || !rawCookie) {
      const apis = getShowcaseApis();
      setApiList(apis);
      setRecentActivities(apis.slice(0, 3));
      setProductCount(
        apis.reduce((acc, item) => acc + (item.items?.length || 0), 0)
      );
      setName(rawCookie ? JSON.parse(rawCookie).company : "Nextract Demo");
      setIsLoading(false);
      return;
    }

    fetch(
      `${
        process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
      }://${serverURL}/dashboard/users/recent-activitiy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: JSON.parse(userId!).id,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => setRecentActivities(data))
      .catch((err) => console.error(err));

    fetch(
      `${
        process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
      }://${serverURL}/dashboard/users/finishedapis`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: JSON.parse(userId!).id,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Server responded with error: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        setApiList(data);
        const count = data.reduce((acc: number, item: DataItem) => {
          return acc + (Array.isArray(item.items) ? item.items.length : 0);
        }, 0);
        setProductCount(count);
        setIsLoading(false);

        setName(
          JSON.parse(rawCookie).company
            ? JSON.parse(rawCookie).company.charAt(0).toUpperCase() +
                JSON.parse(rawCookie).company.slice(1)
            : "you whitout a name"
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        setApiList([]);
        setIsLoading(false);
      });
  }, [
    userId,
    setApiList,
    setRecentActivities,
    setProductCount,
    setIsLoading,
    setName,
    serverURL,
  ]);

  useEffect(() => {
    setAPIkey("");
    setApi("");
    setIsLoading(true);
    fetchApis();
  }, [fetchApis, setAPIkey, setApi]);

  useEffect(() => {
    const controls = animate(count, productCount, { duration: 2 });
    return () => controls.stop();
  }, [count, productCount]);
  const handleClick = (apiUrl: Api) => {
    setActiveAPI(apiUrl);
  };

  const updateApi = (activeAPI: DataObject) => {
    console.log("activeapi typeof " + typeof activeAPI);
    setApi(activeAPI.originalApi.apiUrl);
    setAPIkey("Test");
    setApiId(activeAPI.id);
    router.push("/dashboard/api?preset=true");
  };

  const deleteApi = async (id: string) => {
    try {
      if (!serverURL) {
        deleteShowcaseApi(id);
        fetchApis();
        setShowModal(false);
        return;
      }

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
        }://${serverURL}/dashboard/users/delete-api`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ APIId: id }),
        }
      );

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log("API deleted:", data);
      fetchApis();
      setShowModal(false);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  function timeAgoOrDate(isoString: string): string {
    const now: Date = new Date();
    const then: Date = new Date(isoString);

    const diffMs = now.getTime() - then.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) {
      return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
    } else if (diffHr < 24) {
      return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
    } else {
      return then.toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
  }

  useEffect(() => {
    if (!serverURL || !userId) {
      setChatSessions([
        {
          id: "showcase-chat",
          preview: "Showcase helper is available in demo mode.",
        },
      ]);
      return;
    }

    // Load chat sessions
    fetch(
      `${
        process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
      }://${serverURL}/dashboard/chat/sessions?userId=${JSON.parse(userId!).id}`
    )
      .then((res) => res.json())
      .then(setChatSessions);
  }, [userId, serverURL]);

  const openChat = (sessionId: string | null) => {
    setActiveChatId(sessionId);
    setChatOpen(true);
  };

  return (
    <div className={styles.container}>
      <div>
        <h1>Welcome {name} to your Dashboard</h1>
        <h3>Manage your APIs, products and website content easily.</h3>
      </div>
      <div className={styles.grid}>
        <div className={styles.dash + " " + styles.status}>
          <h3>Activity</h3>
          {isLoading ? (
            <LoadingCircleSpinner />
          ) : (
            <ul>
              {recentActivities.map((item, index) => {
                return (
                  <li key={item.id + index} className={styles.activityItem}>
                    <p className={styles.APIname}>{item.APIname}</p>
                    <p className={styles.timeText}>
                      {timeAgoOrDate(item.date)}
                    </p>
                    <span
                      style={{
                        color: item.type === "created" ? "green" : "orange",
                      }}
                    >
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className={styles.dash + " " + styles.products}>
          <h3>Total Products</h3>
          {isLoading ? (
            <LoadingCircleSpinner />
          ) : (
            <h4>
              <motion.pre className={styles.pre}>{rounded}</motion.pre>
            </h4>
          )}
        </div>
        <div className={styles.dash + " " + styles.recent}>
          <h3>Your API&apos;s</h3>
          {showModal ? (
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowModal(false);
                }
              }}
              className={styles.modalContainer}
            >
              <div className={styles.apiModal}>
                <h1>{activeAPI?.APIname}</h1>
                <div className={styles.jsonView}>
                  <JsonViewer json={activeAPI?.items || []} />
                </div>
                <button
                  onClick={() => {
                    if (activeAPI) {
                      updateApi(activeAPI);
                    }
                  }}
                  className={styles.updateBtn}
                >
                  Update this API
                </button>
                <button
                  onClick={() => {
                    deleteApi(activeAPI ? activeAPI.id : "");
                  }}
                  className={styles.deleteBtn}
                >
                  Delete this API
                </button>
              </div>
            </div>
          ) : null}
          {isLoading ? (
            <LoadingCircleSpinner />
          ) : (
            <ul>
              {Array.isArray(apiList) &&
                apiList.map((item, index) => {
                  return (
                    <motion.li
                      className={styles.listItem}
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        scale: {
                          type: "spring",
                          visualDuration: 0.4,
                          bounce: 0.5,
                        },
                      }}
                    >
                      <button
                        onClick={() => {
                          handleClick(item);
                          setShowModal(true);
                        }}
                        className={styles.listBtn}
                      >
                        {item.APIname ? item.APIname : "Unnamed API: " + index}
                      </button>
                      <span className={styles.active}>
                        <Image height={20} src={tickCircle} alt="tickcircle" />
                      </span>
                    </motion.li>
                  );
                })}
            </ul>
          )}
        </div>
        <div className={styles.dash + " " + styles.support}>
          <h3>Support Replies</h3>
          <div className={styles.chatHistory}>
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className={styles.chatPreview}
                onClick={() => openChat(session.id)}
              >
                {session.preview}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Link href="/dashboard/api">
        <button className={styles.button}>Add new API</button>
      </Link>

      {chatOpen && (
        <ChatWindow
          onClose={() => setChatOpen(false)}
          sessionId={activeChatId}
        />
      )}
    </div>
  );
}
