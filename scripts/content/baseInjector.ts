import {ILimit} from "../models/limit";
import {INewsSite} from "../models/newsSite";
import {ITabData} from "../models/tabData";
import {getHtmlTemplate} from "../util/util";
import BaseOverlay from "./baseOverlay";
import Log from "../util/debug";
import {CLASS_PREFIX} from "../config/constants";

class BaseInjector {
  protected _injectedDomElements: HTMLElement[];
  protected _limits: ILimit[];
  protected _sites: INewsSite[];
  protected _templateName: string;
  protected _templateClass: string;
  protected _overlay: BaseOverlay;
  protected _rootElementName: string;

  constructor(rootElm: string = "") {
    this._injectedDomElements = [];
    this._limits = [];
    this._sites = [];
    this._templateName = "";
    this._rootElementName = `${CLASS_PREFIX}${rootElm}`;
    this._templateClass = `.${this._rootElementName}`;
  }

  init(data: ITabData) {
    this._overlay.init();

    if (data == null) return;

    this.setValuesFromData(data);

    getHtmlTemplate(this._templateName, this._templateClass).then(
      (html: HTMLElement) => {
        this.onTemplateLoaded(html);
      }
    );
  }

  update(data: ITabData) {
    this.setValuesFromData(data);
  }

  onTemplateLoaded(html: HTMLElement) {
    this.inject();
  }

  setValuesFromData(data) {
    // Here is all i need to send the data to the dev tools panel
    // log data and send to the background script
    Log.info(data);
    // chrome.runtime.sendMessage(data);

    if (typeof data.sites !== "undefined")
      this._sites = data.sites.map((item, index) => item.data);
    if (typeof data.limits !== "undefined")
      this._limits = data.limits
        .map((item, index) => item.data)
        .sort((a: ILimit, b: ILimit): number => a.value - b.value);
  }

  clear() {}

  inject() {
    this.clear();
  }
}

export default BaseInjector;
