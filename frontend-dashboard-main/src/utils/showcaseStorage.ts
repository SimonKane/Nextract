import {
  defaultShowcaseApis,
  demoUser,
  ShowcaseApi,
} from "@/utils/showcaseData";

const API_STORAGE_KEY = "nextract-showcase-apis";

const canUseStorage = () => typeof window !== "undefined";

export function getShowcaseApis(): ShowcaseApi[] {
  if (!canUseStorage()) return defaultShowcaseApis;

  const storedApis = window.localStorage.getItem(API_STORAGE_KEY);
  if (!storedApis) {
    window.localStorage.setItem(
      API_STORAGE_KEY,
      JSON.stringify(defaultShowcaseApis)
    );
    return defaultShowcaseApis;
  }

  try {
    const parsed = JSON.parse(storedApis);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : defaultShowcaseApis;
  } catch {
    return defaultShowcaseApis;
  }
}

export function saveShowcaseApi(api: ShowcaseApi) {
  if (!canUseStorage()) return;
  const apis = getShowcaseApis();
  window.localStorage.setItem(API_STORAGE_KEY, JSON.stringify([api, ...apis]));
}

export function updateShowcaseApi(id: string, items: Record<string, unknown>[]) {
  if (!canUseStorage()) return;
  const apis = getShowcaseApis().map((api) =>
    api.id === id
      ? { ...api, items, type: "updated" as const, date: new Date().toISOString() }
      : api
  );
  window.localStorage.setItem(API_STORAGE_KEY, JSON.stringify(apis));
}

export function deleteShowcaseApi(id: string) {
  if (!canUseStorage()) return;
  const apis = getShowcaseApis().filter((api) => api.id !== id);
  window.localStorage.setItem(
    API_STORAGE_KEY,
    JSON.stringify(apis.length > 0 ? apis : defaultShowcaseApis)
  );
}

export function createDemoSession(company?: string, email?: string) {
  if (!canUseStorage()) return demoUser;

  const user = {
    ...demoUser,
    company: company || demoUser.company,
    email: email || demoUser.email,
  };

  window.localStorage.setItem("user", user.email);
  return user;
}
