import Storage from "./storage/storage";
import IStorageItem from "./storage/storageItem";
import {messageTypes} from "../config/messageTypes";
import * as Api from "../util/api";
import Log from "../util/debug";
import {INewsSite} from "../models/newsSite";
import {ILimit} from "../models/limit";
import StorageType from "./storage/storageType";
import {RELOAD_DELAY} from "../config/constants";
import {EndPoints} from "../util/enums";
import {headline} from "../models/headline";
import {find_headline_id} from "../util/util";

class Background {
    private storage: Storage = Storage.getInstance();
    private cacheReloadToken: number;

    init() {
        this.loadSupportedSites();
        // Reloads all headlines each minute
        this.cacheReloadToken = <number>(
            setInterval(this.reloadCache.bind(this), RELOAD_DELAY)
        );
    }

    notifyTabOfNewData(site: INewsSite) {
        chrome.tabs.query({}, tabs => {
            for (let tab of tabs) {
                if (tab.url.indexOf(site.base_url) > -1) {
                    chrome.tabs.sendMessage(tab.id, {type: messageTypes.SITES_UPDATED, payload: {}});
                }
            }
        });
    };

    /**
     * Reloads all the headlines for all sites
     */

    reloadSites() {
        // For all sites in localstorage
        for (let index = 0; index < this.storage.sites.count(); index++) {
            // Get headlines
            this.getHeadlinesOnFrontPage(this.storage.sites.at(index).data);

            // Get articles
            this.getArticlesOnFrontPage(this.storage.sites.at(index).data);


        }
    }


    /**
     * Reloads storage with headlines and limits
     */
    reloadCache() {
        this.load<ILimit>(this.storage.limits, EndPoints.LIMIT, "key").then(
            // Why only get the headlines here?
            () => this.reloadSites()
        );
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
     * @param url
     * @return True if the site is supported and false otherwise
     */
    siteIsSupported(url) {
        return this.getBaseUrlIfSupported(url) != '';
    }

    /**
     * A method to get the articles currently in localstorage
     * @param url: base url for the site that the user is currently visiting (read this as: The user has development tools
     *  open and the inspected window is a site that is supported by this application).
     */
    getArticles(url) {
        url = this.getBaseUrlIfSupported(url);
        if (url != '') {
            return this.storage.sites.get(url).data.articles
        }
    }

    /**
     * A method to get the headlines currently in localstorage
     * @param url: base url for the site that the user is currently visiting (read this as: The user has development tools
     *  open and the inspected window is a site that is supported by this application).
     */
    getHeadlines(url) {
        url = this.getBaseUrlIfSupported(url);
        if (url != '') {
            return this.storage.sites.get(url).data.headlines
        }
    }

    /**
     * Takes as input an url and checks if one of the supported sites base urls is a part of the input string
     * @param url
     */
    getBaseUrlIfSupported(url) {
        let sites = this.storage.sites.all();
        for (let site of sites) {
            if (url.includes(site.key)) {
                return site.key
            }
        }
        return ''
    }

    /**
     * Fetches all headlines for a site
     * @param site
     */
    getHeadlinesOnFrontPage(site: INewsSite) {
        Api
            .get(`${EndPoints.SITE}${site.id}/${EndPoints.HEADLINE}`)
            .then((headlines: headline[]) => {
                Log.info(
                    `Downloaded ${headlines.length} Headlines downloaded for ${
                        site.name
                        }`,
                    headlines
                );
                let storedNewsSiteObject = this.storage.sites.get(site.base_url);
                if (storedNewsSiteObject !== null) {
                    storedNewsSiteObject.data.headlines = headlines;
                    this.storage.sites.update(storedNewsSiteObject);
                }
            })
            .catch(error => {
                Log.error(error);
            });
    }

    /**
     * This will update the articles currently stored in local storage and can be rewritten to only give a message
     * if there is a change in the data stored in the localstorage.
     * We only want the data that is on the front page of the online newspaper.
     *
     * @param site: The online newspaper that we want to query the server for articles from.
     */
    getArticlesOnFrontPage(site: INewsSite) {
        Log.error('this.articlesOnFrontPage() is executed');
        Api
            .get(`${EndPoints.SITE}${site.id}/${EndPoints.ARTICLES}`)
            .then((articles: any[]) => {
                Log.info(
                    `Downloaded ${articles.length} articles downloaded for ${
                        site.name
                        }`,
                    articles
                );

                let storedNewsSiteObject = this.storage.sites.get(site.base_url);
                if (storedNewsSiteObject !== null) {
                    storedNewsSiteObject.data.articles = articles;
                    this.storage.sites.update(storedNewsSiteObject);
                }
            })
            .catch(error => {
                Log.error(error);
            });
    }

    /**
     * Fetches all the supported sites, then their headlines, then we need to grab all the articles
     */
    loadSupportedSites() {
        Api.get(EndPoints.SITE).then(data => {
            let sites: INewsSite[] = <INewsSite[]>data;
            for (let site of sites) {
                site.headlines = [];
                site.articles = [];
                let item: IStorageItem = {
                    data: site,
                    key: site.base_url
                };
                this.storage.sites.add(item);
            }
            // At this point all the sites are stored in localstorage
            // We want to store the articles and the headlines on the front page as well
            // ReloadCache should do this for us
            this.reloadCache();
        });
    }

    frontPage(url: string) {
        // Remove the first https:// from the url and check if there exist a key that is equal to this url
        // And remove the last / as this is not present in the key value of the base of the news sites base url
        url = url.replace('https://www.', '');
        url = url.replace('/', '');

        for (let site of this.storage.sites.all()) {
            if (site.key == url) {
                return true;
            }
        }
        return false;

    }

    getArticleUrl(url: string) {
        for (let site of this.storage.sites.all()) {
            if (url.includes(site.key)) {
                return find_headline_id(url, site.data.urlTemplates);
            }
        }
        return null;
    }

    getSite(url: string) {
        for (let site of this.storage.sites.all()) {
            if (url.includes(site.key)) {
                return site.data;
            }
        }
        return null;
    }
}

export default Background;
