import Deck from '../core/Deck.js';
import Portfolio from '../core/Portfolio.js';
import DeckBuilderElement from './DeckBuilderElement.js';
import { createElement as ce, registerEventListener } from './utils.js';

export default class PortfolioElement extends HTMLElement {
	/** @type {Portfolio} */ #portfolio;
	/** @type {Element=} */ #deckList;
	/** @type {DeckBuilderElement=} */ #deckBuilderEl;
	
	constructor () {
		super();
		this.#portfolio = new Portfolio();
		registerEventListener(this, 'click', 'button', () => this.#onAddNew())
		registerEventListener(this, 'click', 'li', evt => this.#onDeckSelect(evt))
	}

	#onDeckSelect(/** @type {Event} */ evt) {
		const id = evt.target?.id;
		this.#portfolio.getDecks()
			.then(decks => decks.find(deck => deck.id == id))
			.then(deck => {
				if(!deck) {
					return;
				}
				const old = this.#deckBuilderEl;
				this.#deckBuilderEl = new DeckBuilderElement({
					deck
				})
			})
	}

	#onAddNew() {
		this.#portfolio.createDeck(Object.assign(
				new Deck(),
				{id: crypto.randomUUID(), name: "test 1"}
			))
			.then(deck => {
				this.#deckList?.append(ce('li', {id: deck.id}, deck.name || "Unnamed"))
			});
	}

	build () {
		this.#deckList = ce('ol', {}, [
		]);
		const sideBarEl = ce('nav', {}, [
			ce('button', {}, "New Deck"),
			this.#deckList
		])
		this.#deckBuilderEl = new DeckBuilderElement();
		this.append(
			sideBarEl,
			this.#deckBuilderEl
		);
	}

	connectedCallback () {
		this.build();
		this.#portfolio.getDecks()
			.then(decks => {
				const els = decks.map(deck => ce('li', {id: deck.id}, deck.name || "Unnamed"));
				this.#deckList?.append(...els);
			})
	}
}
