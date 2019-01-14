class FindAttributeOnElementInHtmlTree {
    private action: any;
    private attribute: string;

    constructor(action: any, attribute: string = 'news-enhancer-headline-id') {
        this.attribute = attribute;
        this.action = action;
    }

    /**
     * Tries to find an attribute on a node. If found then do a action. Else check parent of node
     * @param {HTMLElement} node Current node
     * @param {number} steps Current dept in the tree
     * @param {number} maxSteps Max depth downwards in the tree
     * @param {string} direction Direction to go to the enxt element in the tree (either up or down)
     * @returns {boolean} if the attr is found or not
     */
    findAttr(node: HTMLElement, steps: number, maxSteps: number, direction: string) {
        if (steps === maxSteps)
            return false;

        if (node === null || typeof node === "undefined" || <Element> node === null)
            return false;


        if (typeof node.hasAttribute === 'function' && node.hasAttribute(this.attribute)) {
            this.action(node.getAttribute(this.attribute));
            return true;
        } else {
            if (direction === "up") {
                return this.findAttr((<HTMLElement>node.parentNode), steps + 1, maxSteps, direction);
            } else {
                if (node.hasChildNodes()) {
                    for (let i = 0; i < node.children.length; i++) {
                        if (this.findAttr((<HTMLElement>node.children[i]), steps + 1, maxSteps, direction)) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }
}

export default FindAttributeOnElementInHtmlTree;