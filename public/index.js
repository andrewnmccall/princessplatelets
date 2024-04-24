import { CardSet, Card, Game, CardSlot, GameLaneCollector, PlayCardAction } from './core.js';

/**
 *
 * @param {HTMLElement} element
 * @param {function(new:HTMLElement)} ElementClass
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

class CardElement extends HTMLElement {
	/** @type {Card} */
	#card;
	constructor () {
		super();
		this.innerHTML = '';
	}

	/** @param {Card} value */
	set card (value) {
		this.#card = value;
		this.setAttribute('id', value.id);
		const cubeWidth = 14;
		const gap = 5;
		const step = cubeWidth + gap;
		const arr5 = [1, 2, 3, 4, 5];
		this.innerHTML = `<table>
			<tr><th>Name</th><td>${this.#card.cardType.name}</td><tr>
			<tr><th>Power</th><td>${this.#card.cardType.power}</td><tr>
			<tr><th>Replacer</th><td>${this.#card.cardType.replacer}</td><tr>
			<tr><th>Pawn</th><td>${this.#card.cardType.pawnRequirement}</td><tr>
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
	/** @type {CardSet} */
	#cardSet;
	/** @type {CardElement[]} */
	#cardEls = [];
	#multiple = false;
	#selected = [];

	set cardSet (set) {
		this.#cardSet = set;
		this.#cardSet.cards.forEach(card => {
			const cardEl = new CardElement();
			cardEl.card = card;
			this.addCard(cardEl);
		});
		this.#cardSet.on(CardSet.EVENT_CHANGED, evt => {
			/** @type {GameElement} el */
			const el = findParentElement(this, GameElement);
			evt.added.forEach(card => this.addCard(el.getCardElementByID(card.id)));
		});
	}

	addCard (cardEl) {
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

	set multiple (val) {
		this.#multiple = val;
	}
}

class PortfolioElement extends DeckElement {
}

class GameLaneCollectorElement extends HTMLElement {
	#row = 0;
	#player = 0;
	/** @type {GameElement} */
	#gameElement;
	/** @type {Game} */
	#game;
	/** @type {GameLaneCollector} */
	#gameLaneCollector;
	constructor (props = {}, children = []) {
		super();
		this.#row = props.row;
		this.#player = props.player;
	}

	build () {
		this.innerHTML = `<table>
			<tr><th>Points</th><td>${this.#gameLaneCollector.points}</td><tr>
			<tr><th>Mod</th><td>${this.#gameLaneCollector.modifier}</td><tr>
		</table>`;
	}

	connectedCallback () {
		/** @type {GameElement} el */
		const el = findParentElement(this, GameElement);
		if (el) {
			this.#gameElement = el;
			this.#game = el.game;
			this.#gameLaneCollector = el.game.getGameLaneCollector(
				this.#player,
				this.#row
			);
			this.#gameLaneCollector.on('change', () => this.build());
			// el.game.on(Game.EVENT_CARD_PLAYED, args => {
			// 	const cardEl = document.getElementById(args.card.id);
			// 	this.#rowEls[args.row].children.item(args.col + 1).replaceChildren(cardEl);
			// });
			this.build();
		}
	}
}

class CardSlotElement extends HTMLElement {
	#row;
	#col;
	/** @type {CardSlot} */
	#cardSlot;
	constructor (r, c, s) {
		super();
		this.#row = r;
		this.#col = c;
		this.#cardSlot = s;
		this.#cardSlot.on(CardSlot.EVENT_CHANGE, () => this.build());
		this.build();
	}

	build () {
		/** @type {GameElement} el */
		const gameElement = findParentElement(this, GameElement);
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
	/** @type {GameElement} */
	#gameElement;
	/** @type {Game} */
	#game;
	constructor () {
		super();
		this.addEventListener('click', evt => {
			const cardSlotElement = (evt.target instanceof CardSlotElement)
				? evt.target
				: findParentElement(evt.target, CardSlotElement);
			if (cardSlotElement) {
				const el = this.#gameElement.getSelectedCardEl();
				if (el) {
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
		this.#rowEls = [];
		for (let i = 0; i < 3; i++) {
			const el = this.ownerDocument.createElement('div');
			el.append(new GameLaneCollectorElement({ row: i, player: 0 }));
			for (let j = 0; j < 5; j++) {
				el.append(new CardSlotElement(i, j, this.#game.getSlot(i, j)));
			}
			el.append(new GameLaneCollectorElement({ row: i, player: 1 }));
			this.#rowEls.push(el);
		}
		this.replaceChildren(...this.#rowEls);
	}

	connectedCallback () {
		/** @type {GameElement} el */
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
	#resetEl;
	#board;
	#hand1;
	#hand2;
	/** @type {GameLogElement} */ #log;
	/** @type {Game} */
	#game;
	constructor () {
		super();
		this.#game = new Game();
		this.#game.on(
			Game.EVENT_CARD_PLAYED,
			args => {

			}
		);

		this.#resetEl = this.ownerDocument.createElement('button');
		this.#resetEl.innerHTML = 'Reset';
		this.append(this.#resetEl);

		this.#resetEl.addEventListener('click', () => this.reset());
		this.#log = new GameLogElement();
		this.append(this.#log);

		this.#hand2 = new DeckElement();
		this.#hand2.cardSet = this.#game.hand2;
		this.append(this.#hand2);

		this.#board = new GameBoardElement();
		this.append(this.#board);

		this.#hand1 = new DeckElement();
		this.#hand1.cardSet = this.#game.hand1;
		this.append(this.#hand1);
	}

	getSelectedCardEl () {
		return this.#hand1.getSelectedCardEl();
	}

	reset () {
	}

	get game () {
		return this.#game;
	}

	/** @returns {CardElement} */
	getCardElementByID (/** @type {String} */ id) {
		const card = this.#game.getCardByID(id);
		const out = document.getElementById(id);
		if (out) {
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

	attributeChangedCallback (name, oldValue, newValue) {
		console.log(`Attribute ${name} has changed.`);
	}
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
