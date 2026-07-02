"use client";

import styles from "@/app/dashboard/api/api.module.css";
import FileUpload from "@/components/apiComponents/FileUpload";
interface ApiInputSelectionProps {
  api: string;
  apiKey: string;
  originalApi: string;
  originalApiKey: string;
  setApi: (val: string) => void;
  setApiKey: (val: string) => void;
  onSubmit: () => void;
}

const ApiInputSection: React.FC<ApiInputSelectionProps> = ({
  api,
  apiKey,
  originalApi,
  originalApiKey,
  setApi,
  setApiKey,
  onSubmit,
}) => {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label}>URL</label>
      <div className={styles.urlInput}>
        <input
          type="text"
          name="api"
          id="api"
          placeholder="API URL or leave empty for demo data"
          className={styles.apiInput}
          value={originalApi || api}
          onChange={(event) => setApi(event.target.value)}
          disabled={!!originalApi}
        />
        <button className={styles.submitButton} onClick={onSubmit}>
          Submit
        </button>
        <div className={styles.file}>
          <FileUpload />
        </div>
      </div>

      <label className={styles.label}>API Key</label>
      <input
        type="password"
        name="api-key"
        placeholder={originalApiKey ? "**********" : "API Key"}
        id="api-key"
        className={styles.apiInput}
        value={apiKey}
        onChange={(event) => setApiKey(event.target.value)}
        disabled={!!originalApiKey}
      />
    </div>
  );
};

export default ApiInputSection;
