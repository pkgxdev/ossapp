import axios from "axios";
import type { Session } from "$libs/types";
import bcrypt from "bcryptjs";
import { getSession } from "$libs/stores/auth";

export const baseUrl = "https://api.tea.xyz/v1";

export async function get<T>(
  urlPath: string,
  params?: { [key: string]: string }
): Promise<T | null> {
  console.log(`GET /v1/${urlPath}`);

  const [session] = await Promise.all([getSession()]);

  const headers =
    session?.device_id && session?.user
      ? await getHeaders(`GET/${urlPath}`, session)
      : { Authorization: "public " };

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

async function getHeaders(path: string, session: Session) {
  const unixMs = new Date().getTime();
  const unixHexSecs = Math.round(unixMs / 1000).toString(16); // hex
  const deviceId = session.device_id?.split("-")[0];
  const preHash = [unixHexSecs, session.key, deviceId, path].join("");

  const Authorization = bcrypt.hashSync(preHash, 10);

  return {
    Authorization,
    ["tea-ts"]: unixMs.toString(),
    ["tea-uid"]: session.user?.developer_id,
    ["tea-gui_id"]: session.device_id
  };
}
