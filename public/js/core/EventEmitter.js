export default class EventEmitter {
	/** @type {Object.<symbol, Array<() => any>>} */
	#listeners = {};

	/** @returns {Symbol[]} */
	eventNames () {
		return [];
	}

	/** @returns {undefined} */
	emit (/** @type {symbol} */ eventName, /** @type {Object} */ args) {
		if (this.eventNames().indexOf(eventName) < 0) {
			const eventNameString = eventName.toString();
			throw new Error('Unregistered event: ' + eventNameString);
		}
		this.#listeners[eventName]?.forEach((/** @type {Function} */ cb) => cb(args));
	}

	/** @returns {undefined} */
	on (/** @type {symbol} */ eventName, /** @type {Function} */ callback) {
		if (this.eventNames().indexOf(eventName) < 0) {
			const eventNameString = eventName.toString();
			throw new Error('Unregistered event: ' + eventNameString);
		}
		this.#listeners[eventName] = this.#listeners[eventName] ?? [];
		this.#listeners[eventName].push(callback);
	}
}
