import { showcaseProducts } from "@/utils/showcaseData";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchData = async (api: string, endpoint = "", setState: any) => {
  if (!api || api === "showcase://demo-products") {
    setState(endpoint === "/1" ? [showcaseProducts[0]] : showcaseProducts);
    return;
  }

  try {
    const response = await fetch(api + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if response is empty
    const text = await response.text();
    if (!text) {
      console.error("Error: Empty response from server");
      return;
    }

    try {
      const result = JSON.parse(text);
      if (response.ok) {
        setState(Array.isArray(result) ? result : [result]);
      }
    } catch (error) {
      console.error("Error: Invalid JSON response", {
        status: response.status,
        statusText: response.statusText,
        responseText: text,
        error: error,
      });
    }
  } catch (error) {
    console.error("Error: Failed to fetch data", error);
    setState(endpoint === "/1" ? [showcaseProducts[0]] : showcaseProducts);
  }
};
