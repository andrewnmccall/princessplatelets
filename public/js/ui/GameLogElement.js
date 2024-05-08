import { GameLog, GameLogCollection } from '../core.js';

export default class GameLogElement extends HTMLElement {
	/**
	 * @typedef {Object} GameLogElementArgs
	 * @property {GameLogCollection=} log
	 * @param {GameLogElementArgs=} props
	 * @param {Array<String|HTMLElement>=} children
	 */
	constructor (props, children) {
		super();
		if (props?.log) {
			props?.log.on(GameLogCollection.EVENT_APPEND, (/** @type {any} */ args) => {
				if (args?.item instanceof GameLog) {
					const div = this.ownerDocument.createElement('div');
					div.innerText = args.item.message;
					this.prepend(div);
				}
			});
		}
		this.innerText = 'Bad Action.';
	}
}
