import axios from "axios";
import type { Session } from "$libs/types";
import bcrypt from "bcryptjs";
import { getSession } from "$libs/stores/auth";
import { getHeaders } from "@native";
import log from "./logger";

export const baseUrl = "https://api.tea.xyz/v1";

export async function get<T>(
  urlPath: string,
  params?: { [key: string]: string }
): Promise<T | null> {
  log.info(`GET /v1/${urlPath}`);

  const headers = await getHeaders(`GET/${urlPath}`);
  delete headers["User-Agent"]; // this is in the browser, not allowed to modify UserAgent

  const req = await axios.request({
    method: "GET",
    baseURL: "https://api.tea.xyz",
    url: ["v1", ...urlPath.split("/")].filter((p) => p).join("/"),
    headers,
    params,
    validateStatus: (status) => status >= 200 && status < 300
  });

  return req.data as T;
}
