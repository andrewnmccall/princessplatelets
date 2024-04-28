import { CardSet, Card, Game, CardSlot, GameLaneCollector, PlayCardAction, PassAction } from './core.js';

/**
 * @template {HTMLElement} ElementClass
 *
 * @param {HTMLElement} element
 * @param {new() => ElementClass} ElementClass
 * @returns {ElementClass=}
 */
const findParentElement = function (element, ElementClass) {
	if (!element.parentElement) {
		return undefined;
	}
	if (element.parentElement instanceof ElementClass) {
		return element.parentElement;
	}
	return findParentElement(element.parentElement, ElementClass);
};

const registerEventListener = function (
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
				if (evt.target instanceof HTMLElement) {
					if (evt.target.closest(selector)) {
						callback(evt);
					}
				}
			}
	);
};

class CardElement extends HTMLElement {
	/** @type {Card=} */
	#card;
	constructor () {
		super();
		this.innerHTML = '';
	}

	/** @param {Card=} value */
	set card (value) {
		this.#card = value;
		if (!value) {
			return;
		}
		this.setAttribute('id', value.id);
		const cubeWidth = 14;
		const gap = 5;
		const step = cubeWidth + gap;
		const arr5 = [1, 2, 3, 4, 5];
		this.innerHTML = `<table>
			<tr><th>Name</th><td>${value.cardType.name}</td><tr>
			<tr><th>Power</th><td>${value.cardType.power}</td><tr>
			<tr><th>Replacer</th><td>${value.cardType.replacer}</td><tr>
			<tr><th>Pawn</th><td>${value.cardType.pawnRequirement}</td><tr>
		</table>
		<svg xmlns="http://www.w3.org/2000/svg">
			${arr5.map((v, row) => arr5.map((v2, col) => `
				<rect
					x="${5 + (col * step)}%"
					y="${5 + (row * step)}%"
					width="${cubeWidth}%"
					height="${cubeWidth}%" />
			`)).flat().join('')}
			<rect
				class="center"
				x="${5 + (2 * step)}%"
				y="${5 + (2 * step)}%"
				width="${cubeWidth}%"
				height="${cubeWidth}%" />
			${value.cardType.getAreas().map(([col, row, type]) => `
				<rect
					class="${type}"
					x="${5 + (col * step)}%"
					y="${5 + (row * step)}%"
					width="${cubeWidth}%"
					height="${cubeWidth}%" />
			`).join('')}
		</svg>`;
	}

	get card () {
		return this.#card;
	}
}

class DeckElement extends HTMLElement {
	/** @type {?CardSet} */
	#cardSet = null;
	/** @type {CardElement[]} */
	#cardEls = [];
	/** @type {Boolean} */
	#multiple = false;
	/** @type {CardElement[]} */
	#selected = [];

	set cardSet (/** @type {?CardSet} */set) {
		this.#cardSet = set;
		if (!this.#cardSet) {
			return;
		}
		this.#cardSet.cards.forEach(card => {
			const cardEl = new CardElement();
			cardEl.card = card;
			this.addCard(cardEl);
		});
		this.#cardSet.on(CardSet.EVENT_CHANGED, (/** @type {any} */ evt) => {
			const el = findParentElement(this, GameElement);
			if (!el) {
				return;
			}
			evt.added.forEach((/** @type {Card} */ card) => this.addCard(el.getCardElementByID(card.id)));
		});
	}

	addCard (/** @type {CardElement} */ cardEl) {
		cardEl.setAttribute('draggable', 'true');
		cardEl.addEventListener('click', evt => {
			this.dispatchEvent(new Event('input'));
			this.#cardEls.forEach(el => el.removeAttribute('selected'));
			cardEl.setAttribute('selected', 'selected');
			this.#selected = [cardEl];
		});
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

	set multiple (/** @type {Boolean} */ val) {
		this.#multiple = val;
	}
}

class PortfolioElement extends DeckElement {
}

class GameLaneCollectorElement extends HTMLElement {
	/** @type {Number} */ #row = 0;
	/** @type {String} */ #player;
	/** @type {?GameLaneCollector} */ #gameLaneCollector = null;

	/**
	 * @param {Object} props
	 * @param {Number} props.row
	 * @param {String} props.player
	 * @param {Array<String|HTMLElement>=} children
	 */
	constructor ({ row, player }, children = []) {
		super();
		this.#row = row;
		this.#player = player;
	}

	build () {
		this.innerHTML = `<table>
			<tr><th>Points</th><td>${this.#gameLaneCollector?.points}</td><tr>
			<tr><th>Mod</th><td>${this.#gameLaneCollector?.modifier}</td><tr>
		</table>`;
	}

	connectedCallback () {
		const el = findParentElement(this, GameElement);
		if (el) {
			this.#gameLaneCollector = el.game.getGameLaneCollector(
				this.#player,
				this.#row
			);
			this.#gameLaneCollector.on(GameLaneCollector.EVENT_CHANGED, () => this.build());
			this.build();
		}
	}
}

class CardSlotElement extends HTMLElement {
	#row;
	#col;
	/** @type {CardSlot=} */ #cardSlot;

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
		const gameElement = findParentElement(this, GameElement);
		if (!this.#cardSlot) {
			return;
		}
		if (this.#cardSlot.card && gameElement) {
			const cardEl = gameElement.getCardElementByID(this.#cardSlot.card.id);
			this.replaceChildren(cardEl);
			return;
		}
		this.innerHTML = `<table>
			<tr><th>Player</th><td>${this.#cardSlot.player ?? ''}</td><tr>
			<tr><th>Pawns</th><td>${this.#cardSlot.pawnCount}</td><tr>
		</table>`;
	}

	get row () { return this.#row; }
	get col () { return this.#col; }
}

class GameBoardElement extends HTMLElement {
	/** @type {HTMLDivElement[]} */
	#rowEls = [];
	/** @type {GameElement=} */
	#gameElement;
	/** @type {Game=} */
	#game;

	constructor () {
		super();
		this.addEventListener('click', evt => {
			const cardSlotElement = (evt.target instanceof CardSlotElement)
				? evt.target
				: (evt.target instanceof HTMLElement
					? findParentElement(evt.target, CardSlotElement)
					: undefined
				);
			if (cardSlotElement && this.#gameElement) {
				const el = this.#gameElement.getSelectedCardEl();
				if (el && el.card) {
					const playCardAction = Object.assign(new PlayCardAction(), {
						row: cardSlotElement.row,
						col: cardSlotElement.col,
						cardId: el.card.id,
						playerId: '1'
					});
					this.#gameElement.game.act(playCardAction);
					// this.#gameElement.game.placeCard(cardSlotElement.row, cardSlotElement.col, el.card);
					// cardSlotElement.appendChild(el);
				}
			}
		});
	}

	buildSlots () {
		if (!this.#game) {
			return;
		}
		this.#rowEls = [];
		for (let i = 0; i < 3; i++) {
			const el = this.ownerDocument.createElement('div');
			el.append(new GameLaneCollectorElement({ row: i, player: '0' }));
			for (let j = 0; j < 5; j++) {
				el.append(new CardSlotElement({ row: i, column: j, slot: this.#game.getSlot(i, j) }));
			}
			el.append(new GameLaneCollectorElement({ row: i, player: '1' }));
			this.#rowEls.push(el);
		}
		this.replaceChildren(...this.#rowEls);
	}

	connectedCallback () {
		const el = findParentElement(this, GameElement);
		if (el) {
			this.#gameElement = el;
			this.#game = el.game;
			// el.game.on(Game.EVENT_CARD_PLAYED, args => {
			// 	const cardEl = document.getElementById(args.card.id);
			// 	this.#rowEls[args.row].children.item(args.col + 1).replaceChildren(cardEl);
			// });
			this.buildSlots();
		}
	}
}

class GameLogElement extends HTMLElement {
	constructor () {
		super();
		this.innerText = 'Bad Action.';
	}
}
class GameElement extends HTMLElement {
	/** @type {HTMLButtonElement=} */ #resetEl = undefined;
	/** @type {GameBoardElement=} */ #board = undefined;
	/** @type {DeckElement=} */ #hand1 = undefined;
	/** @type {DeckElement=} */ #hand2 = undefined;
	/** @type {GameLogElement=} */ #log;
	/** @type {Game} */ #game;

	constructor () {
		super();
		this.#game = new Game();
		this.#game.on(
			Game.EVENT_CARD_PLAYED,
			(/** @type {any} */ args) => {

			}
		);
		registerEventListener(this, 'click', '[data-game-action=reset]', () => this.reset());
		registerEventListener(this, 'click', '[data-game-action=pass]', () => this.pass());
		this.build();
	}

	build () {
		this.innerHTML = '';
		this.#resetEl = this.ownerDocument.createElement('button');
		this.#resetEl.innerHTML = 'Reset';
		this.#resetEl.setAttribute('data-game-action', 'reset');

		const passEl = this.ownerDocument.createElement('button');
		passEl.innerHTML = 'Pass';
		passEl.setAttribute('data-game-action', 'pass');

		this.#log = new GameLogElement();

		this.#hand2 = new DeckElement();
		this.#hand2.cardSet = this.#game.hand2;

		this.#board = new GameBoardElement();

		this.#hand1 = new DeckElement();
		this.#hand1.cardSet = this.#game.hand1;
		this.replaceChildren(
			this.#resetEl,
			passEl,
			this.#log,
			this.#hand2,
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
		const card = this.#game.getCardByID(id);
		const out = document.getElementById(id);
		if (out instanceof CardElement) {
			return out;
		}
		const cardEl = new CardElement();
		cardEl.card = card;
		return cardEl;
	}
}

class DeckBuilderElement extends HTMLElement {
	#deckElement;
	#portfolioElement;
	static observedAttributes = [
		'deck-id',
		'deck-selector',
		'potfolio-id',
		'potfolio-selector'
	];

	constructor () {
		super();
		console.log(this.childNodes);
		this.#deckElement = new DeckElement();
		this.append(this.#deckElement);

		this.#portfolioElement = new PortfolioElement();
		// this.#portfolioElement.cardSet = source;
		this.append(this.#portfolioElement);
		this.addEventListener('click', evt => this.onClick(evt));
	}

	/** @param {Event} evt  */
	onClick (evt) {
		if (evt.target instanceof CardElement) {
			if (this.#deckElement.contains(evt.target)) {
				evt.target.remove();
			}
			if (this.#portfolioElement.contains(evt.target)) {
				this.#deckElement.append(evt.target);
			}
			console.log(evt.target);
		}
	}

	connectedCallback () {
		console.log('Custom element added to page.');
	}

	disconnectedCallback () {
		console.log('Custom element removed from page.');
	}

	adoptedCallback () {
		console.log('Custom element moved to new page.');
	}

	// attributeChangedCallback (name, oldValue, newValue) {
	// 	console.log(`Attribute ${name} has changed.`);
	// }
}

customElements.define('pp-card', CardElement);
customElements.define('pp-deck', DeckElement);
customElements.define('pp-portfolio', PortfolioElement);
customElements.define('pp-cardslot', CardSlotElement);
customElements.define('pp-gamelanecollector', GameLaneCollectorElement);
customElements.define('pp-gameboard', GameBoardElement);
customElements.define('pp-gamelog', GameLogElement);
customElements.define('pp-game', GameElement);
customElements.define('pp-deckbuilder', DeckBuilderElement);
