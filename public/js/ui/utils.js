/**
 * @template {HTMLElement} ElementClass
 *
 * @param {HTMLElement} element
 * @param {new() => ElementClass} ElementClass
 * @returns {ElementClass=}
 */
export const findParentElement = function (element, ElementClass) {
	if (!element.parentElement) {
		return undefined;
	}
	if (element.parentElement instanceof ElementClass) {
		return element.parentElement;
	}
	return findParentElement(element.parentElement, ElementClass);
};

export const ifElse = (cond = true, trueCB = () => '', falseCB = () => '') => cond ? trueCB() : falseCB();

export const registerEventListener = function (
	/** @type {HTMLElement} */ el,
	/** @type {String} */ eventType,
	/** @type {String} */ selector,
	/** @type {(evt: Event) => any} */ callback
) {
	el.addEventListener(
		eventType,
		selector === ''
			? callback
			: (evt) => {
				if (evt.target instanceof Element) {
					if (evt.target.closest(selector)) {
						callback(evt);
					}
				}
			}
	);
};
