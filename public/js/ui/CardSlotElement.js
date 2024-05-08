import { CardSlot } from '../core.js';
import CardElementProvider from './CardElementProvider.js';
import { ifElse } from './utils.js';

export default class CardSlotElement extends HTMLElement {
	#row;
	#col;
	/** @type {CardSlot=} */ #cardSlot;
	/** @type {CardElementProvider=} */ #cardElementProvider;

	/**
	 * @typedef {Object} CardSlotElementArgs
	 * @property {Number=} row
	 * @property {Number=} column
	 * @property {CardSlot=} slot
	 * @param {CardSlotElementArgs=} props
	 * @param {Array<String|HTMLElement>=} children
	 */
	constructor (
		props,
		children
	) {
		super();
		this.#row = props?.row;
		this.#col = props?.column;
		this.#cardSlot = props?.slot;
		this.#cardSlot?.on(CardSlot.EVENT_CHANGE, () => this.build());
		this.build();
	}

	build () {
		if (!this.#cardSlot) {
			return;
		}
		if (this.#cardSlot.card && this.#cardElementProvider) {
			const cardEl = this.#cardElementProvider.getCardElementByID(this.#cardSlot.card.id);
			this.replaceChildren(cardEl);
			return;
		}
		this.#cardSlot.player === undefined
			? this.removeAttribute('player')
			: this.setAttribute('player', this.#cardSlot.player || '');
		this.#cardSlot.player === '1'
			? this.setAttribute('sessionplayer', 'sessionplayer')
			: this.removeAttribute('sessionplayer');
		this.setAttribute('pawnCount', '' + this.#cardSlot.pawnCount);
		const effects = this.#cardSlot.getEffects();
		this.innerHTML = `<table>
			<tr><th>Player</th><td>${this.#cardSlot.player ?? ''}</td><tr>
			<tr><th>Pawns</th><td>${this.#cardSlot.pawnCount}</td><tr>
		</table>
		${ifElse(!!effects.length,
			() => '<i class="fa-solid fa-star"></i>'
		)}`;
	}

	get row () { return this.#row; }
	get col () { return this.#col; }
	set cardElementProvider (/** @type {CardElementProvider=} */set) { this.#cardElementProvider = set; }
}
