/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import styles from "@/app/dashboard/api/api.module.css";
import { useAllDataStore, useDataStore } from "@/lib/store";
import { useRef, useState } from "react";

export default function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

  const uploadFile = async (file: File) => {
    const { setData } = useDataStore.getState();
    const { setAllData } = useAllDataStore.getState();

    const formData = new FormData();
    formData.append("file", file);

    try {
      if (!serverURL) {
        const text = await file.text();
        const data =
          file.name.endsWith(".json") || file.type.includes("json")
            ? JSON.parse(text)
            : parseCsv(text);
        const normalized = normalizeData(data);
        setData(normalized);
        setAllData(normalized);
        setError(null);
        return;
      }

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
        }://${serverURL}/dashboard/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }

      const data = await res.json();

      let normalized = Array.isArray(data)
        ? data
        : data.catalog?.product ||
          data.catalog ||
          data.products?.product ||
          data.items || [data];

      if (
        Array.isArray(normalized) &&
        normalized.length === 1 &&
        typeof normalized[0] === "object" &&
        Array.isArray((normalized[0] as any).catalog)
      ) {
        normalized = (normalized[0] as any).catalog;
      }

      const seen = new Set<string>();
      const duplicates = normalized.map((item: Record<string, any>) => {
        const result: any = {};
        for (const [key, value] of Object.entries(item)) {
          if (!seen.has(key)) {
            seen.add(key);
            result[key] = value;
          }
        }
        return result;
      });

      setData(duplicates);
      setAllData(duplicates);
      setError(null);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const normalizeData = (data: any) => {
    return Array.isArray(data)
      ? data
      : data.catalog?.product ||
          data.catalog ||
          data.products?.product ||
          data.items || [data];
  };

  const parseCsv = (text: string) => {
    const [headerLine, ...rows] = text.trim().split(/\r?\n/);
    const headers = headerLine.split(",").map((header) => header.trim());

    return rows.map((row) => {
      const values = row.split(",").map((value) => value.trim());
      return headers.reduce<Record<string, string>>((item, header, index) => {
        item[header] = values[index] || "";
        return item;
      }, {});
    });
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv,.xml,.xlsx"
        className={styles.hiddenDefaultInput}
        onChange={onFileChange}
      />
      <button
        type="button"
        className={styles.iconButton}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg
          className={styles.icon}
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.75 18.7326C13.75 19.423 14.3096 19.9826 15 19.9826C15.6904 19.9826 16.25 19.423 16.25 18.7326V9.78539L20.3034 13.8388L22.0712 12.0711L15.0001 5L7.92908 12.0711L9.69684 13.8388L13.75 9.78568V18.7326Z"
            fill="black"
          />
          <path
            d="M5 17.5H7.5V22.5H22.5V17.5H25V22.5C25 23.8807 23.8807 25 22.5 25H7.5C6.11929 25 5 23.8807 5 22.5V17.5Z"
            fill="black"
          />
        </svg>
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
