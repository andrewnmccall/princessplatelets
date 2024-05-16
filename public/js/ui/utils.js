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

/**
 * @returns {PropertyDescriptor=}
 */
const getPropertyDescriptor = function (
	/** @type {object} */ obj,
	/** @type {string} */ prop
) {
	const out = Object.getOwnPropertyDescriptor(obj, prop);
	if (out) {
		return out;
	}
	const proto = Object.getPrototypeOf(obj);
	if (proto) {
		return getPropertyDescriptor(proto, prop);
	}
	return undefined;
};
/**
 * @returns {Element}
 */
export const createElement = function (
	/** @type {(typeof Element)|String} */ Tag,
	/** @type {Object=} */ props = {},
	/** @type {String|Element|Array.<String|Element>=} */ children = []
) {
	/** @type {any|Element} */
	let out;
	if (typeof Tag === 'function') {
		out = new Tag();
	} else {
		out = document.createElement(Tag);
	}
	Object.entries(props).forEach(([k, v]) => {
		const pD = getPropertyDescriptor(out, k);
		if (pD) {
			out[k] = v;
		} else if (out instanceof Element) {
			out.setAttribute(k, v);
		}
	});
	if (typeof out.append === 'function') {
		if (children.constructor === Array) {
			out.append(...children);
		} else {
			out.append(children);
		}
	}
	return out;
};
