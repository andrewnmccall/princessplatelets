import { Game } from '../core/Game.js';
import CardElement from './CardElement.js';
export default class CardElementProvider {
	/** @type {Game=} */ #game;

	set game (/** @type {Game=} */ val) {
		this.#game = val;
	}

	/** @returns {CardElement} */
	getCardElementByID (/** @type {String} */ id) {
		const out = document.getElementById(id);
		if (out instanceof CardElement) {
			return out;
		}
		const cardEl = new CardElement();
		cardEl.card = this.#game?.getCardByID(id);
		return cardEl;
	}
}
