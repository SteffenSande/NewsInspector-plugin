import Storage from "./storage/storage";
import StorageItem from "./storage/storageItem";
import IStorageItem from "./storage/storageItem";
import {createMessage, messageTypes} from "../config/messageTypes";
import * as Api from "../util/api";
import Log from "../util/debug";
import {INewsSite} from "../models/newsSite";
import {ILimit} from "../models/limit";
import {ReportCategory} from "../models/reportCategory";
import StorageType from "./storage/storageType";
import ContextMenu from "./contextMenu";
import {ISubmission} from "../models/submission";
import Notification from "../models/notification";
import {ITabData} from "../models/tabData";
import {IArticle} from "../models/article";
import {RELOAD_DELAY} from "../config/constants";
import Wordcloud from "./wordcloud";
import {EndPoints} from "../util/enums";
import {headline} from "../models/headline";

class Background {
  public contextMenu: ContextMenu;
  private storage: Storage = Storage.getInstance();
  private cacheReloadToken: number;
  private _wordCloud: Wordcloud = null;

  constructor(cloud: Wordcloud) {
    this._wordCloud = cloud;
  }

  init() {
    this.contextMenu = new ContextMenu(this._wordCloud);
    this.loadSupportedSites();

    // Reloads all headlines each minute
    this.cacheReloadToken = <number>(
      setInterval(this.reloadCache.bind(this), RELOAD_DELAY)
    );
  }

  notifyTabOfNewData = (site: INewsSite) => {
    chrome.tabs.query({}, tabs => {
      for (let tab of tabs) {
        if (tab.url.indexOf(site.base_url) > -1) {
          chrome.tabs.sendMessage(
            tab.id,
            createMessage(messageTypes.SITES_UPDATED)
          );
          Log.info("Updating tab", tab.url);
        }
      }
    });
  };

  /**
   * Reloads all the headlines for all sites
   */
  reloadHeadlines() {
    for (let index = 0; index < this.storage.sites.count(); index++) {
      this.getHeadlinesOnFrontPage(this.storage.sites.at(index).data).then(
        () => {
          this.notifyTabOfNewData(this.storage.sites.at(index).data);
        }
      );
    }
  }

  /**
   * Reloads storage with headlines and limits
   */
  reloadCache() {
    this.load<ILimit>(this.storage.limits, EndPoints.LIMIT, "key").then(
      () => this.reloadHeadlines()
    );
    this.load<ReportCategory>(
      this.storage.reportCategory,
        EndPoints.REPORT_CATEGORY,
      "category"
    ).then(() => this.contextMenu.reload());
  }

  load<T>(storage: StorageType, apiCall: string, key: string): Promise<void> {
    return Api.get(apiCall).then((elements: T[]) => {
      for (let elm of elements) {
        let l = storage.get(elm[key].toString());
        let item: IStorageItem = {
          key: elm[key].toString(),
          data: elm
        };
        if (l === null) {
          storage.add(item);
        } else {
          storage.update(item);
        }
      }

      Log.info(`Fetched ${elements.length} from ${apiCall}`, elements);
    });
  }

  /**
   * Checks if a site is supported
   * If so, it returns all the current headlines objects
   * @param url
   * @param callback function to execute with the data from api
   */
  siteIsSupported(url, callback): StorageItem {
    let sites = [];

    if (this.storage.sites.exists(url)) {
      sites = [this.storage.sites.get(url)];
    } else {
      sites = this.storage.sites.all();
    }

    let data: ITabData = {
      sites: sites,
      limits: this.storage.limits.all()
    };

    return callback(data);
  }

  /**
   * Fetches all headlines for a site
   * @param site
   * @returns {Promise<void>}
   */
  getHeadlinesOnFrontPage(site: INewsSite): Promise<void> {
    // @ts-ignore
    return new Promise((resolve, reject) => {
        Api
        .get(`${EndPoints.SITE}${site.id}/${EndPoints.HEADLINE}`)
        .then((headlines: headline[]) => {
          Log.info(
            `Downloaded ${headlines.length} Headlines downloaded for ${
              site.name
            }`,
            headlines
          );
          let item = this.storage.sites.get(site.base_url);
          if (item !== null) {
            item.data.headlines = headlines;
            this.storage.sites.update(item);
          }
          resolve();
        })
        .catch(error => {
          Log.error(error);
          reject();
        });
    });
  }

  /**
   * Fetches all the supported sites, then their headlines
   */
  loadSupportedSites() {
    Api.get(EndPoints.SITE).then(data => {
      let sites: INewsSite[] = <INewsSite[]>data;
      Log.info(`Fetched ${sites.length} sites`, sites);
      for (let site of sites) {
        site.headlines = [];
        let item: IStorageItem = {
          data: site,
          key: site.base_url
        };
        this.storage.sites.add(item);
      }
      this.reloadCache();
    });
  }

  submit(submission: ISubmission) {
    Api.post(submission.url, submission.payload).then(data => {
      if (submission.notification !== null) {
        submission.notification.message = data.message;
        Notification.notifyUser(submission.notification);
      }

      if (!data.error) this.reloadCache();
    });
  }

  fetchArticle(data, callback) {
    let url = `${data.siteId}/${EndPoints.ARTICLE}${EndPoints.SEARCH}`;
      Api
      .get(`${EndPoints.SITE}${url}?url=${data.url}`)
      .then(data => {
        let article: IArticle = <IArticle>data;
        Log.info(`Fetched article ${article.headline}`, article);

        let reportCategories = [];
        for (let item of this.storage.reportCategory.all()) {
          reportCategories.push(item.data);
        }

        callback({ article: article, reportCategories: reportCategories });
      })
      .catch(erro => {
        callback({ article: null });
      });
  }

  fetchHeadlineDataForLinks(data, callback) {
      Api
      .post(`${EndPoints.SEARCH}${EndPoints.HEADLINES}`, data)
      .then(response => {
        callback({ info: response });
      })
      .catch(erro => {
        callback({ article: null });
      });
  }
}

export default Background;
