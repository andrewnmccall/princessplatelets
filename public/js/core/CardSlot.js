import EventEmitter from './EventEmitter.js';
import { CardEffect, CardEffectTarget } from '../core.js';
import Card from './Card.js';

export default class CardSlot extends EventEmitter {
	/** @type {symbol} */ static EVENT_CHANGE = Symbol('change');
	/** @type {number} */ #row;
	/** @type {number} */ #col;
	/** @type {Card=} */ #card;
	/** @type {number} */ #pawnCount = 0;
	/** @type {String=} */ #player;
	/** @type {Object.<string, Object.<string, CardEffect[]>>} */ #effects = {};

	/**
	 * @param {Object} args
	 * @param {number} args.row
	 * @param {number} args.col
	 * @param {number} [args.pawnCount]
	 * @param {string} [args.player]
	 */
	constructor ({
		row, col, pawnCount, player
	}) {
		super();
		this.#row = row;
		this.#col = col;
		this.#pawnCount = pawnCount ?? 0;
		this.#player = player;
	}

	/** @return {number} */
	get pawnCount () {
		return this.#pawnCount;
	}

	/** @return {Card=} */
	get card () {
		return this.#card;
	}

	/** @return ?{string} */
	get player () {
		return this.#player;
	}

	/** @return {String=} */
	get playerID () {
		return this.#player;
	}

	get row () { return this.#row; }
	get col () { return this.#col; }

	change (
		/** @type {number} */ pawnCountInc,
		/** @type {string} */ player,
		/** @type {?Card} */ card
	) {
		this.#pawnCount = this.#pawnCount + pawnCountInc;
		this.#player = player;
		if (card || card === false) {
			this.#card = card;
		}
		this.emit(CardSlot.EVENT_CHANGE, {});
		this.#applyEffectsToCard();
	}

	addEffects (
		/** @type {string} */ playerId,
		/** @type {string} */ cardId,
		/** @type {CardEffect[]} */ effects
	) {
		this.#effects[playerId] = this.#effects[playerId] || {};
		this.#effects[playerId][cardId] = this.#effects[playerId][cardId] || [];
		this.#effects[playerId][cardId].push(...effects);
		this.emit(CardSlot.EVENT_CHANGE, {});
		this.#applyEffectsToCard();
	}

	addEffectsFromCard (
		/** @type {string} */ playerId,
		/** @type {Card} */ card
	) {
		if (card.cardType.effect) {
			this.addEffects(playerId, card.id, [card.cardType.effect]);
		}
	}

	/** @returns {CardEffect[]} */
	getEffects (/** @type {string=} */ playerId) {
		if (playerId) {
			return Object.values(this.#effects[playerId] || {}).flat();
		}
		return Object.values(this.#effects)
			.map(idEffectMap => Object.values(idEffectMap))
			.flat(2);
	}

	eventNames () {
		return [
			CardSlot.EVENT_CHANGE
		];
	}

	#applyEffectsToCard () {
		if (!this.#card) {
			return;
		}
		Object.keys(this.#effects).forEach(playerId => {
			Object.keys(this.#effects[playerId]).forEach(cardId => {
				const effects = this.#effects[playerId][cardId].filter(cardEffect => {
					if (!this.#card) {
						return false;
					}
					if (cardEffect.target === CardEffectTarget.ENEMY &&
						playerId === this.#player) {
						return false;
					}
					return true;
				});
				this.#card?.setEffects(cardId, effects);
			});
		});
	}
}
