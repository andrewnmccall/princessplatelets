import { PassAction } from '../core.js';
import { Game } from '../core/Game.js';
import CardElement from './CardElement.js';
import CardElementProvider from './CardElementProvider.js';
import DeckElement from './DeckElement.js';
import GameBoardElement from './GameBoardElement.js';
import GameLaneCollectorElement from './GameLaneCollectorElement.js';
import GameLogElement from './GameLogElement.js';
import { registerEventListener } from './utils.js';

export default class GameElement extends HTMLElement {
	/** @type {HTMLDivElement=} */ #phaseEl = undefined;
	/** @type {HTMLButtonElement=} */ #resetEl = undefined;
	/** @type {GameBoardElement=} */ #board = undefined;
	/** @type {DeckElement=} */ #hand1 = undefined;
	/** @type {DeckElement=} */ #hand2 = undefined;
	/** @type {GameLogElement=} */ #log;
	/** @type {Game} */ #game;
	/** @type {CardElementProvider} */ #cardElementProvider;

	constructor () {
		super();
		this.#game = new Game();
		this.#cardElementProvider = new CardElementProvider();
		this.#cardElementProvider = new CardElementProvider();
		this.#cardElementProvider.game = this.#game;
		this.#game.on(
			Game.EVENT_ACTION,
			(/** @type {any} */ args) => {
				if (this.#phaseEl) {
					this.#phaseEl.innerText = 'Phase: ' + this.#game.phase;
				}
			}
		);
		registerEventListener(this, 'click', '[data-game-action=reset]', () => this.reset());
		registerEventListener(this, 'click', '[data-game-action=pass]', () => this.pass());
		registerEventListener(this, 'click', '[data-game-action=reroll]', () => this.reroll());
		const mutationObserver = new MutationObserver((mutations, observer) => {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(node => {
						if (node instanceof GameLaneCollectorElement) {
							node.game = this.#game;
						}
						if (node instanceof GameBoardElement) {
							node.cardElementProvider = this.#cardElementProvider;
							node.game = this.#game;
							node.sourceHand = this.#hand1;
						}
						if (node instanceof DeckElement) {
							node.game = this.#game;
							node.cardElementProvider = this.#cardElementProvider;
						}
					});
				}
			}
		});
		mutationObserver.observe(this, { subtree: true, childList: true });
		this.build();
	}

	build () {
		this.innerHTML = '';
		this.#phaseEl = this.ownerDocument.createElement('div');
		this.#phaseEl.innerText = 'Phase: ' + this.#game.phase;
		this.#resetEl = this.ownerDocument.createElement('button');
		this.#resetEl.innerHTML = 'Reset';
		this.#resetEl.setAttribute('data-game-action', 'reset');

		const passEl = this.ownerDocument.createElement('button');
		passEl.innerHTML = 'Pass';
		passEl.setAttribute('data-game-action', 'pass');

		const rerollEl = this.ownerDocument.createElement('button');
		rerollEl.innerHTML = 'Reroll';
		rerollEl.setAttribute('data-game-action', 'reroll');

		this.#log = new GameLogElement({
			log: this.#game.log
		});

		// this.#hand2 = new DeckElement();
		// this.#hand2.cardSet = this.#game.hand2;

		this.#board = new GameBoardElement();

		this.#hand1 = new DeckElement();
		this.#hand1.cardSet = this.#game.hand1;
		this.replaceChildren(
			this.#resetEl,
			passEl,
			rerollEl,
			this.#phaseEl,
			this.#log,
			// this.#hand2,
			this.#board,
			this.#hand1
		);
	}

	getSelectedCardEl () {
		return this.#hand1?.getSelectedCardEl();
	}

	reset () {
		this.#game.reset();
		this.build();
		console.log('Reset');
	}

	reroll () {
		this.#hand1?.reroll();
	}

	pass () {
		const playCardAction = Object.assign(new PassAction(), {
			playerId: '1'
		});
		this.#game.act(playCardAction);
		console.log('Pass');
	}

	get game () {
		return this.#game;
	}

	/** @returns {CardElement} */
	getCardElementByID (/** @type {String} */ id) {
		return this.#cardElementProvider.getCardElementByID(id);
	}
}
