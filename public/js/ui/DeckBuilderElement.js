import { cardTypes } from '../core.js';
import { Card } from '../core/Card.js';
import { CardSet } from '../core/CardSet.js';
import CardElementProvider from './CardElementProvider.js';
import DeckElement from './DeckElement.js';
import { createElement as ce, registerEventListener } from './utils.js';

export default class DeckBuilderElement extends HTMLElement {
	/** @type {DeckElement=} */ #targetDeckEl;
	/** @type {DeckElement=} */ #sourceDeckEl;
	// static observedAttributes = [
	// 	'deck-id',
	// 	'deck-selector',
	// 	'potfolio-id',
	// 	'potfolio-selector'
	// ];

	constructor () {
		super();
		const tagName = customElements.getName(DeckElement);
		if (!tagName) {
			throw new Error('DeckElement must be a registered custom element');
		}
		registerEventListener(this, 'change', tagName, evt => {
			if (evt.target === this.#sourceDeckEl) {
				this.#sourceDeckEl.selectedCards.forEach(cardEl => {
					if (!cardEl.card) {
						return;
					}
					this.#targetDeckEl?.cardSet?.append([cardEl.card]);
					this.#sourceDeckEl?.cardSet?.removeCard(cardEl.card);
				});
			}
			console.log(evt);
		});
	}

	build () {
		const target = new CardSet();
		const source = new CardSet();
		/** @type {Object.<String, Number>} */
		const cardTypeCount = {
			soldier: 2,
			ostrich: 2,
			wolf: 2
		};
		cardTypes.forEach(cardType => {
			for (let i = 0; i < (cardTypeCount[cardType.key] || 1); i++) {
				source.cards.push(
					new Card({ cardType })
				);
			}
		});
		const cardElementProvider = new CardElementProvider();
		this.#targetDeckEl = new DeckElement({ cardSet: target, cardElementProvider });
		this.#sourceDeckEl = new DeckElement({ cardSet: source, cardElementProvider });
		const deckBuilderEl = ce('div', {}, [
			ce('div', {}, [
				ce('label', {}, [
					'Name: ',
					ce('input', { type: 'text' })
				])
			]),
			ce('div', {}, [
				ce('h2', {}, 'Deck'),
				this.#targetDeckEl
			]),
			ce('div', {}, [
				ce('h2', {}, 'Card Library'),
				this.#sourceDeckEl
			])
		]);
		this.append(
			deckBuilderEl
		);
	}

	connectedCallback () {
		this.build();
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
