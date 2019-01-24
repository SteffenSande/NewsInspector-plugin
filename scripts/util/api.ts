import Log from "../util/debug";

class Api {
  private _prod: string = "http://165.227.136.59/";
  private _dev: string = "http://localhost:8000/";

  public BaseUrl: string = this._prod;

  private _apiBase: string = `${this.BaseUrl}api/`;

  public static endpoints = {
    REPORT: "submission/headline/report/",
    SITE: "site/",
    ARTICLE: "article/",
    HEADLINE: "headline/",
    REPORT_CATEGORY: "submission/category/",
    LIMIT: "limit/",
    WORDCLOUD_GENERATOR_SITE: "wordcloud_generator/site/",
    WORDCLOUD_GENERATOR_ARTICLE: "wordcloud_generator/article/",
    SUBMIT_SUMMARY: "submission/headline/summary/",
    SEARCH: "search/",
    HEADLINES: "headlines/"
  };

  /**
   * Fetch data from endpoint and converts it to json
   * @param endpoint
   * @returns {Promise<T>}
   */
  public get(endpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(`${this._apiBase}${endpoint}`)
        .then(response => {
          resolve(response.json());
        })
        .catch(error => {
          Log.error(`Could not get ${endpoint}`, error);
          reject();
        });
    });
  }

  public image(endpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(`${endpoint}`)
        .then(response => resolve(response.blob()))
        .catch(error => {
          Log.error(`Could not get ${endpoint}`, error);
          reject();
        });
    });
  }

  public post(endpoint: string, payload: any): Promise<any> {
    return fetch(`${this._apiBase}${endpoint}`, this.post_data(payload))
      .then(response => {
        return response.json();
      })
      .catch(error => {
        Log.error(`Could post ${endpoint}`, error);
      });
  }

  private post_data(
    payload,
    header = "application/x-www-form-urlencoded"
  ): RequestInit {
    let formBody = "";
    for (let property in payload) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(payload[property]);
      formBody += encodedKey + "=" + encodedValue + "&";
    }

    return {
      method: "POST",
      headers: [["Accept", "application/json"], ["Content-Type", header]],
      body: formBody
    };
  }
}

export default Api;
