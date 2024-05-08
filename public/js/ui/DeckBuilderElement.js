import CardElement from './CardElement.js';
import DeckElement from './DeckElement.js';
import PortfolioElement from './PortfolioElement.js';

export default class DeckBuilderElement extends HTMLElement {
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
