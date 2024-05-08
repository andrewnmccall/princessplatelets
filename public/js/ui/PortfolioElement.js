export default class PortfolioElement extends HTMLElement {
	build () {
		this.innerHTML = `<ol>
			<li>Deck 1</li>
			<li>Deck 2</li>
		</ol>`;
	}

	connectedCallback () {
		this.build();
	}
}
