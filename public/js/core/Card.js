import { CardEffect, CardType } from '../core.js';
import EventEmitter from './EventEmitter.js';

export default class Card extends EventEmitter {
	/** @type {symbol} */ static EVENT_CHANGE = Symbol('change');
	/** @type {string} */ id;
	/** @type {Object.<string, CardEffect[]>} */ #effects = {};
	/** @type {CardType} */ cardType;
	/** @type {Boolean} */ invertX = false;

	/**
	 * @param {Object} args
	 * @param {string} [args.id]
	 * @param {Boolean} [args.invertX=false]
	 * @param {CardType} args.cardType
	 */
	constructor ({ id, cardType, invertX = false }) {
		super();
		this.id = id ?? crypto.randomUUID();
		this.invertX = invertX;
		this.cardType = cardType;
	}

	get areas () {
		return this.cardType.getAreas(
			this.invertX
		);
	}

	get power () { return this.cardType.power + this.powerAugment; }
	get powerBase () { return this.cardType.power; }
	get powerAugment () { return Object.values(this.#effects).flat().reduce((sum, item) => sum + (item.power || 0), 0); }

	setEffects (
		/** @type {string} */ cardId,
		/** @type {CardEffect[]} */ effects
	) {
		this.#effects[cardId] = effects;
		this.emit(Card.EVENT_CHANGE, {});
	}

	eventNames () {
		return [
			Card.EVENT_CHANGE
		];
	}
}
