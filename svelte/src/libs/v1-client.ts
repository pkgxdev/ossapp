import axios from "axios";
import { getHeaders } from "@native";
import log from "./logger";

import { isDev } from "@native";

let dev = false;
export const getBaseURL = async (): Promise<string> => {
  if (dev) return "https://app.dev.tea.xyz";
  const notProd = await isDev();
  dev = notProd;
  return notProd ? "https://app.dev.tea.xyz" : "https://app.tea.xyz";
};

export async function get<T>(
  urlPath: string,
  params?: { [key: string]: string }
): Promise<T | null> {
  log.info(`GET /v1/${urlPath}`);
  const baseURL = await getBaseURL();
  const headers = await getHeaders(`GET/${urlPath}`);
  delete headers["User-Agent"]; // this is in the browser, not allowed to modify UserAgent

  const req = await axios.request({
    method: "GET",
    baseURL,
    url: ["v1", ...urlPath.split("/")].filter((p) => p).join("/"),
    headers,
    params,
    validateStatus: (status) => status >= 200 && status < 300
  });

  return req.data as T;
}
