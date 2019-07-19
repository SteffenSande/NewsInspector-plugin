import {ServerLocation} from "./enums";
import Log from "../util/debug";

export let BaseUrl: string = ServerLocation.PROD;
let apiBase: string = `${BaseUrl}api/`;

/**
 * Fetch data from endpoint and converts it to json
 * @param endpoint
 * @returns {Promise<T>}
 */
export function get(endpoint: string): Promise<any> {
  // @ts-ignore
  return new Promise((resolve, reject) => {
    fetch(apiBase + endpoint)
        .then(response => {
          resolve(response.json());
        })
        .catch(error => {
          Log.error(`Could not get ${endpoint}`);
          Log.error(error);
          reject();
        });
  });
}

export function image(endpoint: string): Promise<any> {
  // @ts-ignore
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}`)
        .then(response => resolve(response.blob()))
        .catch(error => {
          Log.error(`Could not get ${endpoint}`);
          Log.error(error);
          reject();
        });
  });
}

export function post(endpoint: string, payload: any): Promise<any> {
  return fetch(`${apiBase}${endpoint}`, post_data(payload))
      .then(response => {
        return response.json();
      })
      .catch(error => {
        Log.error(`Could post ${endpoint}`);
        Log.error(error)
      });
}

export function post_data(
    payload: any,
    header = "application/x-www-form-urlencoded"
): RequestInit {
  let formBody = "";
  for (const property in payload) {
    if (payload.hasOwnProperty(property)) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(payload[property]);
      formBody += encodedKey + "=" + encodedValue + "&";
    }
  }

  return {
    body: formBody,
    headers: [["Accept", "application/json"], ["Content-Type", header]],
    method: "POST"
  };
}
