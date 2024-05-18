import { PlayCardAction } from '../core.js';
import Game from '../core/Game.js';
import CardElementProvider from './CardElementProvider.js';
import CardSlotElement from './CardSlotElement.js';
import DeckElement from './DeckElement.js';
import GameLaneCollectorElement from './GameLaneCollectorElement.js';
import { findParentElement } from './utils.js';

export default class GameBoardElement extends HTMLElement {
	/** @type {HTMLDivElement[]} */
	#rowEls = [];
	/** @type {Game=} */ #game;
	/** @type {DeckElement=} */ #sourceHand;
	/** @type {CardElementProvider=} */ #cardElementProvider;

	constructor () {
		super();
		this.addEventListener('click', evt => {
			const cardSlotElement = (evt.target instanceof CardSlotElement)
				? evt.target
				: (evt.target instanceof HTMLElement
					? findParentElement(evt.target, CardSlotElement)
					: undefined
				);
			if (cardSlotElement && this.#sourceHand) {
				const el = this.#sourceHand.getSelectedCardEl();
				if (el && el.card) {
					const playCardAction = Object.assign(new PlayCardAction(), {
						row: cardSlotElement.row,
						col: cardSlotElement.col,
						cardId: el.card.id,
						playerId: '1'
					});
					this.#game?.act(playCardAction);
				}
			}
		});
	}

	set cardElementProvider (/** @type {CardElementProvider} */set) { this.#cardElementProvider = set; }

	set game (/** @type {Game} */set) {
		this.#game = set;
	}

	set sourceHand (/** @type {DeckElement=} */set) {
		this.#sourceHand = set;
		this.buildSlots();
	}

	buildSlots () {
		if (!this.#game) {
			return;
		}
		this.#rowEls = [];
		for (let i = 0; i < 3; i++) {
			const el = this.ownerDocument.createElement('div');
			let glc = new GameLaneCollectorElement({ row: i, player: '1' });
			glc.game = this.#game;
			el.append(glc);
			for (let j = 0; j < 5; j++) {
				const appendEl = new CardSlotElement({ row: i, column: j, slot: this.#game.getSlot(i, j) });
				appendEl.cardElementProvider = this.#cardElementProvider;
				el.append(appendEl);
			}
			glc = new GameLaneCollectorElement({ row: i, player: '2' });
			glc.game = this.#game;
			el.append(glc);
			this.#rowEls.push(el);
		}
		this.replaceChildren(...this.#rowEls);
	}

	connectedCallback () {
		this.buildSlots();
	}
};
