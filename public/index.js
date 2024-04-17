import { CardSet, Card, Game, CardSlot } from './core.js';

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
		this.innerHTML = `<table>
			<tr><th>Name</th><td>${this.#card.cardType.name}</td><tr>
			<tr><th>Power</th><td>${this.#card.cardType.power}</td><tr>
			<tr><th>Replacer</th><td>${this.#card.cardType.replacer}</td><tr>
			<tr><th>Pawn</th><td>${this.#card.cardType.pawnRequirement}</td><tr>
		</table>`;
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
			cardEl.setAttribute('draggable', 'true');
			cardEl.addEventListener('click', evt => {
				this.dispatchEvent(new Event('input'));
				this.#cardEls.forEach(el => el.removeAttribute('selected'));
				cardEl.setAttribute('selected', 'selected');
				this.#selected = [cardEl];
			});
			this.#cardEls.push(cardEl);
			this.append(cardEl);
		});
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
		this.#cardSlot.on('change', () => this.build());
		this.build();
	}

	build () {
		this.innerHTML = `<table>
			<tr><th>Player</th><td>${this.#cardSlot.player ?? ''}</td><tr>
			<tr><th>Pawns</th><td>${this.#cardSlot.pawnCount}</td><tr>
		</table>`;
	}

	get row () { return this.#row; }
	get col () { return this.#col; }
}

class RowTrackerElement extends HTMLElement {
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
			if (evt.target instanceof CardSlotElement) {
				const el = this.#gameElement.getSelectedCardEl();
				if (el) {
					this.#gameElement.game.placeCard(evt.target.row, evt.target.col, el.card);
					// evt.target.appendChild(el);
				}
			}
		});
	}

	buildSlots () {
		this.#rowEls = [];
		for (let i = 0; i < 3; i++) {
			const el = this.ownerDocument.createElement('div');
			el.append(new RowTrackerElement());
			for (let j = 0; j < 5; j++) {
				el.append(new CardSlotElement(i, j, this.#game.getSlot(i, j)));
			}
			el.append(new RowTrackerElement());
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
			el.game.on(Game.EVENT_CARD_PLAYED, args => {
				const cardEl = document.getElementById(args.card.id);
				this.#rowEls[args.row].children.item(args.col + 1).replaceChildren(cardEl);
			});
			this.buildSlots();
		}
	}
}

class GameElement extends HTMLElement {
	#resetEl;
	#board;
	#hand1;
	#hand2;
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
		this.#board = new GameBoardElement();
		this.append(this.#board);

		this.#hand1 = new DeckElement();
		this.#hand1.cardSet = this.#game.cardSet1;
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
customElements.define('pp-rowtracker', RowTrackerElement);
customElements.define('pp-gameboard', GameBoardElement);
customElements.define('pp-game', GameElement);
customElements.define('pp-deckbuilder', DeckBuilderElement);
