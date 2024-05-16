import DeckBuilderElement from './DeckBuilderElement.js';
import { createElement as ce } from './utils.js';

export default class PortfolioElement extends HTMLElement {
	build () {
		const listEl = ce('ol', {}, [
			ce('li', {}, 'Deck 1'),
			ce('li', {}, 'Deck 2')
		]);
		const deckBuilderEl = new DeckBuilderElement();
		this.append(
			listEl,
			deckBuilderEl
		);
	}

	connectedCallback () {
		this.build();
	}
}
