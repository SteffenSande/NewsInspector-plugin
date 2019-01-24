import { getHtmlTemplate } from "../util/util";
import Log from "../util/debug";
import { CLASS_PREFIX } from "../config/constants";
import { createConnection } from "net";
import { createMessage, messageTypes } from "../config/messageTypes";
import elements = chrome.devtools.panels.elements;

class BaseOverlay {
  protected _rootElementName: string;
  protected _element: HTMLElement;
  protected _contentNode: HTMLElement;
  protected _templateName: string;
  protected _templateClass: string;

  public isHoveringOverlay: boolean;

  constructor(rootElm: string = "") {
    this.isHoveringOverlay = false;
    this._templateName = "";
    this._contentNode = null;
    this._element = null;
    this._rootElementName = `${CLASS_PREFIX}${rootElm}`;
    this._templateClass = `.${this._rootElementName}`;
  }

  /**
   * Loads all templates
   */
  init() {
    getHtmlTemplate(this._templateName, this._templateClass).then(
      (html: HTMLElement) => {
        this.onTemplateLoaded(html);
      }
    );
  }

  onTemplateLoaded(html: HTMLElement) {}

  setBaseElement(html: HTMLElement) {
    if (this._element !== null) {
      this._element.remove();
    }

    this._element = html;
    let node = <Node>this._element;
    document.body.appendChild(node);

    this._element.onmouseover = () => (this.isHoveringOverlay = true);
    this._element.onmouseout = () => (this.isHoveringOverlay = false);
    // Here the element is created, but this implementation is very steadfast on using the current templates and code.
    // I might just rewrite this cause it will be simpler and i can write better code.
  }

  updateContent(data: any): void {}

  show() {
    this._element.style.display = "block";
  }

  /**
   * Hides the overlay
   */
  hide(): void {
    this._element.style.display = "none";
  }
}

export default BaseOverlay;
