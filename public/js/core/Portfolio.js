import EventEmitter from './EventEmitter.js';
import { GamePhases, cardTypes, GameLogCollection, CardType, RerollAction, GameActionResult, PassAction, GameLog, PlayCardAction, ERROR_CODES, CardAreaType, GameAction } from '../core.js';
import Card from './Card.js';
import CardSlot from './CardSlot.js';
import CardSet from './CardSet.js';
import GameLaneCollector from './GameLaneCollector.js';
import GameAgent from './GameAgent.js';
import Deck from './Deck.js';

export default class Portfolio extends EventEmitter {
	/** @type {symbol} */ static EVENT_CARD_PLAYED = Symbol('card_played');
	/** @type {symbol} */ static EVENT_ACTION = Symbol('action');

	/** @type {Deck[]} */
	#decks = {};

	/** @type {?Promise<CardType[]>} */ #cardTypesPromise = null;

	constructor (
		/** @type {string=} */ uri,
		/** @type {string=} */ userId
	) {
		super();
	}

	/**
	 * @returns {Promise<Deck[]>}
	 */
	getDecks() {
		return Promise.resolve([
			Object.assign(new Deck(), {id: crypto.randomUUID(), name: "test 1"}),
			Object.assign(new Deck(), {id: crypto.randomUUID(), name: "test 2"})
		]);
	}

	/**
	 * 
	 * @returns {Promise<Deck>} deck 
	 */
	createDeck(/** @type {Deck} */ deck)
	{
		return Promise.resolve(deck);
	}

	eventNames () {
		return [
		];
	}
}
