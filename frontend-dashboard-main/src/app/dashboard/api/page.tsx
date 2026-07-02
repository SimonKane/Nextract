"use client";
//#region Imports
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./api.module.css";
//#endregion
//#region imports for components
import ApiInputSection from "@/components/apiComponents/ApiInputSection";
import ConfirmationModal from "@/components/apiComponents/confirmationModal";
import { Converter } from "@/components/apiComponents/Converter";
import { JsonViewer } from "@/components/apiComponents/JsonView";
import SaveApiModal from "@/components/apiComponents/SaveApiModal";
import SaveConnectButtons from "@/components/apiComponents/SaveConnectButtons";
import ViewToggle from "@/components/apiComponents/ViewToggle";
//#endregion

//#region imports for zustand stores
import {
  useAllDataStore,
  useApiIdStore,
  useAPIKeyStore,
  useAPIStore,
  useChosenKeysStore,
  useDataStore,
  useOriginalAPIStore,
  useShowPreviewStore,
} from "@/lib/store";
//#endregion

//#region types
type FilteredData = {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ParsedObject = Record<string, any>;
//#endregion
//#region imports for global functions
import type { KeyValuePair } from "@/utils/extractKeyValuePairs";
import { extractKeyValuePairs } from "@/utils/extractKeyValuePairs";
import { fetchData } from "@/utils/fetchData";
import {
  saveShowcaseApi,
  updateShowcaseApi,
} from "@/utils/showcaseStorage";
//#endregion

export default function Api() {
  const [toggleJson, setToggleJson] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [apiName, setApiName] = useState<string>("");
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

  const searchParams = useSearchParams();
  const preset = searchParams.get("preset");
  const router = useRouter();
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

  //#region states
  const api = useAPIStore((state) => state.api);
  const originalApiKey = useAPIKeyStore((state) => state.key);
  const data = useDataStore((state) => state.data);
  const allData = useAllDataStore((state) => state.allData);
  const chosenKeys = useChosenKeysStore((state) => state.chosenKeys);
  const originalApi = useOriginalAPIStore((state) => state.originalAPI);
  const APIId = useApiIdStore((state) => state.id);
  //#endregion

  //#region setStates
  const setApi = useAPIStore((state) => state.setApi);
  const setData = useDataStore((state) => state.setData);
  const setAllData = useAllDataStore((state) => state.setAllData);
  const setShowPreview = useShowPreviewStore((state) => state.setShowPreview);

  //#endregion
  //#region clearStates

  const clearKey = useAPIKeyStore((state) => state.clearKey);
  const clearOriginalApi = useOriginalAPIStore((state) => state.clearApi);
  const clearAPIId = useApiIdStore((state) => state.clearId);
  const resetChosenKeys = useChosenKeysStore((state) => state.resetChosenKeys);
  //#endregion

  //Function to extract key-value pairs from the data
  const keyValuePairs = useMemo<KeyValuePair[]>(
    () => extractKeyValuePairs(allData),
    [allData]
  );

  //Function to filter the key-value pairs based on the chosen keys
  const filteredData = useMemo(() => {
    return keyValuePairs.filter(({ key }) => chosenKeys.includes(key));
  }, [keyValuePairs, chosenKeys]);

  //Function to parse the flat array of filtered data into an array of objects
  function parseFlatArray(filteredData: FilteredData[]): ParsedObject[] {
    const seen = new Set();
    for (const entry of filteredData) {
      if (seen.has(entry.key)) break;
      seen.add(entry.key);
    }

    const fieldsPerObject = seen.size;
    const result: ParsedObject[] = [];

    for (let i = 0; i < filteredData.length; i += fieldsPerObject) {
      const obj: ParsedObject = {};
      for (let j = 0; j < fieldsPerObject; j++) {
        const entry = filteredData[i + j];
        if (entry) {
          obj[entry.key] = entry.value;
        }
      }
      result.push(obj);
    }
    return result;
  }

  //Function to save the finished customized API to database
  async function saveData() {
    const savedData = parseFlatArray(filteredData);

    try {
      if (!serverURL) {
        saveShowcaseApi({
          id: `showcase-api-${Date.now()}`,
          APIname:
            apiName.charAt(0).toUpperCase() + apiName.slice(1) ||
            "Saved Demo Feed",
          items: savedData,
          originalApi: {
            apiUrl: api || "showcase://manual-save",
          },
          type: "created",
          date: new Date().toISOString(),
        });
        return;
      }

      const userData = Cookies.get("userData");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData.id;

        const createFinishedAPI = await fetch(
          `${
            process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
          }://${serverURL}/dashboard/users/save-api`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              items: savedData,
              userId: userId,
              apiUrl: api,
              apiKey: apiKey,
              APIname: apiName.charAt(0).toUpperCase() + apiName.slice(1),
            }),
          }
        );
        const result = await createFinishedAPI.json();
        console.log("Saved result:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  //Function to save the finished updated API to database
  async function updateApi() {
    const updatedData = parseFlatArray(filteredData);

    try {
      if (!serverURL) {
        updateShowcaseApi(APIId, updatedData);
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
        return;
      }

      const updatedAPI = await fetch(
        `${
          process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
        }://${serverURL}/dashboard/users/update-api`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: updatedData,
            APIId: APIId,
          }),
        }
      );
      const result = await updatedAPI.json();
      console.log("Updated result:", result);
    } catch (error) {
      console.error("Error updating API:", error);
    }
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  }

  //#region UseEffects

  //Theese useEffects are used to fetch the data from the API and set the data in the state
  useEffect(() => {
    if (preset === "true" && originalApi) {
      fetchData(originalApi, "/1", setData);
      fetchData(originalApi, "", setAllData);
      setIsUpdateMode(true);
    } else {
      clearOriginalApi();
      clearKey();
      clearAPIId();
      data.length = 0;
      setIsUpdateMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  //This useEffect is to see if api is in updated mode
  useEffect(() => {
    if (isUpdateMode) {
      resetChosenKeys();
    }
  }, [isUpdateMode, resetChosenKeys]);
  //#endregion

  return (
    <>
      {showModal ? (
        <SaveApiModal
          apiName={apiName}
          setApiName={setApiName}
          onSave={() => {
            saveData();
            setConfirmationMessage("API saved successfully!");
            setShowModal(false);
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
          }}
          onClose={() => setShowModal(false)}
        />
      ) : (
        ""
      )}
      {confirmationMessage && (
        <ConfirmationModal
          isOpen={true}
          message={confirmationMessage}
          onConfirm={() => {
            setConfirmationMessage(null);
          }}
          onClose={() => {
            setConfirmationMessage(null);
          }}
        />
      )}
      <div className={styles.container}>
        <ViewToggle toggleJson={toggleJson} setToggleJson={setToggleJson} />
        <ApiInputSection
          api={api}
          apiKey={apiKey}
          originalApi={originalApi}
          originalApiKey={originalApiKey}
          setApi={setApi}
          setApiKey={setApiKey}
          onSubmit={() => {
            fetchData(api, "/1", setData);
            fetchData(api, "", setAllData);
          }}
        />
        <div className={styles.keyContainer}>
          {data.length === 0 ? (
            <p> </p>
          ) : toggleJson ? (
            <>
              <h2 className={styles.sectionTitle}>
                View: Your Data in JSON Format
              </h2>
              <p className={styles.subText}>
                This is the structured JSON representation of the file you
                uploaded. You can use it for API integration, validation, or as
                a reference for further processing.
              </p>
              <JsonViewer json={allData} />
            </>
          ) : (
            <Converter data={data} />
          )}
        </div>

        <SaveConnectButtons
          isUpdateMode={!!originalApi}
          onUpdate={() => {
            updateApi();
            setConfirmationMessage("API updated successfully!");
          }}
          onCancel={() => router.push("/dashboard")}
          onPreview={() => {
            if (chosenKeys && chosenKeys.length > 0) {
              setShowPreview();
            }
          }}
          onSave={() => {
            if (
              api &&
              api.trim().length > 0 &&
              chosenKeys &&
              chosenKeys.length > 0
            ) {
              setShowModal(true);
            }
          }}
          chosenKeysLength={chosenKeys.length}
          apiUrl={api}
        />
      </div>
    </>
  );
}
