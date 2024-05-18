import Card from '../core/Card.js';
import {
	ifElse
} from './utils.js';

export default class CardElement extends HTMLElement {
	/** @type {Card=} */
	#card;
	/** @type {ElementInternals} */ #internals;

	/**
	 * @param {Object} props
	 * @param {Card=} props.card
	 * @param {Array<String|HTMLElement>=} children
	 */
	constructor ({ card } = { card: undefined }, children = undefined) {
		super();
		this.#internals = this.attachInternals();
		this.card = card;
	}

	/** @param {Card=} value */
	set card (value) {
		this.#card = value;
		this.#card?.on(Card.EVENT_CHANGE, () => this.build());
		this.build();
	}

	build () {
		const value = this.#card;
		if (!value) {
			return;
		}
		this.setAttribute('id', value.id);
		const powerAugment = value.powerAugment;
		if (powerAugment > 0) {
			this.#internals.states.add('--enhanced');
		} else {
			this.#internals.states.delete('--enhanced');
		}
		if (powerAugment < 0) {
			this.#internals.states.add('--enfeebled');
		} else {
			this.#internals.states.delete('--enfeebled');
		}
		const cubeWidth = 14;
		const gap = 5;
		const step = cubeWidth + gap;
		const arr5 = [1, 2, 3, 4, 5];
		this.innerHTML = `<div>
			<div data-prop="cardType.name">${value.cardType.name}</div>
			<div data-prop="cardType.power">${value.power}</div>
			${ifElse(value.cardType.replacer,
				() => '<div data-prop="cardType.replacer"></div>',
				() => `<div data-prop="cardType.pawnRequirement">${value.cardType.pawnRequirement}</div>`
			)}
			${ifElse(!!value.cardType.effect, () => `
			<div data-prop="cardType.effect">
				${ifElse(!!value.cardType.effect?.target,
					() => `<div data-prop="cardType.effect.target" data-prop-value="${value.cardType.effect?.target}"></div>`
				)}
				${ifElse(!!value.cardType.effect?.power,
					() => `<div data-prop="cardType.effect.power"  data-prop-value="${value.cardType.effect?.power}">
						${value.cardType.effect?.power}
					</div>`
				)}
				${ifElse(!!value.cardType.effect?.addCards,
					() => `<div data-prop="cardType.effect.addCards">
						${value.cardType.effect?.addCards?.length}
					</div>`
				)}
			</div>
			`)}
		</div>
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
			${value.areas.map(([col, row, type]) => `
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
