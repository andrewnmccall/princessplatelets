import {
	CardSet, Card, Game, RerollAction, GamePhases
} from '../core.js';
import {
	registerEventListener
} from './utils.js';
import CardElement from './CardElement.js';
import CardElementProvider from './CardElementProvider.js';

export default class DeckElement extends HTMLElement {
	/** @type {CardSet=} */
	#cardSet;
	/** @type {CardElement[]} */
	#cardEls = [];
	/** @type {Game=} */ #game;
	/** @type {CardElementProvider=} */ #cardElementProvider;
	/** @type {Boolean} */
	#multiple = true;
	/** @type {CardElement[]} */
	#selected = [];

	/** @type {Card=} */
	#card;

	/**
	 * @param {Object} props
	 * @param {CardSet=} props.cardSet
	 * @param {CardElementProvider=} props.cardElementProvider
	 * @param {Array<String|HTMLElement>=} children
	 */
	constructor (
		{ cardSet, cardElementProvider } = {},
		children = undefined
	) {
		super();
		this.cardElementProvider = cardElementProvider || new CardElementProvider();
		this.cardSet = cardSet;
		registerEventListener(this, 'click', 'pp-card', evt => {
			const cardEl = evt.target instanceof Element ? evt.target.closest('pp-card') : undefined;
			if (cardEl instanceof CardElement) {
				this.dispatchEvent(new Event('input'));
				if (this.#multiple) {
					if (cardEl.getAttribute('selected')) {
						cardEl.removeAttribute('selected');
						this.#selected = this.#selected.filter(item => item !== cardEl);
					} else {
						cardEl.setAttribute('selected', 'selected');
						this.#selected.push(cardEl);
					}
				} else {
					this.#cardEls.forEach(el => el.removeAttribute('selected'));
					cardEl.setAttribute('selected', 'selected');
					this.#selected = [cardEl];
				}
				this.dispatchEvent(new Event('change', { bubbles: true }));
			}
		});
	}

	get selectedCards () { return [...this.#selected]; }
	get cardSet () { return this.#cardSet; }

	set game (/** @type {Game} */set) { this.#game = set; }
	set cardElementProvider (/** @type {CardElementProvider} */set) { this.#cardElementProvider = set; }

	set cardSet (/** @type {CardSet=} */set) {
		this.#cardSet = set;
		if (!this.#cardSet) {
			return;
		}
		this.#cardSet.cards.forEach(card => this.addCard(new CardElement({ card })));
		this.#cardSet.on(CardSet.EVENT_CHANGED, (/** @type {any} */ evt) => {
			const cep = this.#cardElementProvider;
			if (!cep) {
				return;
			}
			evt.added.forEach((/** @type {Card} */ card) => this.addCard(cep.getCardElementByID(card.id)));
			evt.removed.forEach((/** @type {Card} */ card) => {
				this.#selected = this.#selected.filter(selCard => selCard.card?.id !== card.id);
				try {
					this.removeChild(cep.getCardElementByID(card.id));
				} catch (ex) {

				}
			});
		});
	}

	addCard (/** @type {CardElement} */ cardEl) {
		cardEl.setAttribute('draggable', 'true');
		this.#cardEls.push(cardEl);
		this.append(cardEl);
	}

	/**
	 *
	 * @returns {CardElement|undefined}
	 */
	getSelectedCardEl () {
		return this.#selected[0];
	}

	reroll () {
		const playCardAction = Object.assign(new RerollAction(), {
			cardIds: this.#selected
				.filter(cardEl => !!cardEl.card)
				.map(cardEl => cardEl.card?.id),
			playerId: '1'
		});
		this.#game?.act(playCardAction);
	}

	connectedCallback () {
		this.bindOnGameEvents();
	}

	bindOnGameEvents () {
		this.#game?.on(
			Game.EVENT_ACTION,
			(/** @type {any} */ args) => {
				this.#multiple = this.#game?.phase === GamePhases.REROLL;
			}
		);
	}

	set multiple (/** @type {Boolean} */ val) {
		this.#multiple = val;
	}
}
