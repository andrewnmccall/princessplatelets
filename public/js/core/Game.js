import EventEmitter from './EventEmitter.js';
import { GamePhases, cardTypes, GameLogCollection, CardType, RerollAction, GameActionResult, PassAction, GameLog, PlayCardAction, ERROR_CODES, CardAreaType, GameAction } from '../core.js';
import { Card } from './Card.js';
import { CardSlot } from './CardSlot.js';
import { CardSet } from './CardSet.js';
import { GameLaneCollector } from './GameLaneCollector.js';
import { GameAgent } from './GameAgent.js';


export class Game extends EventEmitter {
    /** @type {symbol} */ static EVENT_CARD_PLAYED = Symbol('card_played');
    /** @type {symbol} */ static EVENT_ACTION = Symbol('action');

    /** @type {Card[]} */ #cards = [];
    /** @type {CardSet=} */ #cardSet1;
    /** @type {CardSet} */ #hand1 = new CardSet();
    /** @type {CardSet=} */ #cardSet2;
    /** @type {CardSet} */ #hand2 = new CardSet();
    /** @type {string} */ #actingPlayerID = '1';
    /** @type {GameAgent=} */ #player2GameAgent;
    /** @type {GameLogCollection=} */ #log;
    /** @type {GameAction[]} */ #actions = [];
    /** @type {GamePhases} */ #phase = GamePhases.REROLL;
	/** @type {CardSlot[][]} */
	#slots = [
		new Array(5),
		new Array(5),
		new Array(5)
	];

	/** @type {Object.<string, GameLaneCollector[]>} */
	#collectors = {};

    /** @type {?Promise<CardType[]>} */ #cardTypesPromise = null;

	constructor() {
		super();
		this.getCardTypes();
		this.reset();
	}

	reset() {
		const source = new CardSet();
		const source2 = new CardSet();
		this.#phase = GamePhases.REROLL;
		cardTypes.forEach(cardType => {
			source.cards.push(
				new Card({ cardType })
			);
			source2.cards.push(
				new Card({ cardType, invertX: true })
			);
		});
		source.shuffle();
		source2.shuffle();
		this.#actions = [];
		this.#log = new GameLogCollection();
		this.#cardSet1 = source;
		this.#cardSet2 = source2;
		this.#cards = [
			...this.#cardSet1.cards,
			...this.#cardSet2.cards
		];
		this.#hand1.cards = source.pop(5);
		this.#hand2.cards = source2.pop(5);
		for (let row = 0; row < 3; row++) {
			this.#slots[row][0] = new CardSlot({ row, col: 0, pawnCount: 1, player: '1' });
			this.#slots[row][1] = new CardSlot({ row, col: 1 });
			this.#slots[row][2] = new CardSlot({ row, col: 2 });
			this.#slots[row][3] = new CardSlot({ row, col: 3 });
			this.#slots[row][4] = new CardSlot({ row, col: 4, pawnCount: 1, player: '2' });
		}
		this.#collectors['1'] = [
			new GameLaneCollector(),
			new GameLaneCollector(),
			new GameLaneCollector()
		];
		this.#collectors['2'] = [
			new GameLaneCollector(),
			new GameLaneCollector(),
			new GameLaneCollector()
		];
		this.#player2GameAgent = new GameAgent(this, '2');
	}

	get cardSet1() {
		return this.#cardSet1;
	}

	get phase() { return this.#phase; }
	get hand1() { return this.#hand1; }

	get hand2() { return this.#hand2; }
	get log() { return this.#log; }

	get cardSet2() {
		return this.#cardSet2;
	}

    /** @return {Promise<CardType[]>} */ getCardTypes() {
		if (this.#cardTypesPromise) {
			return this.#cardTypesPromise;
		}
		this.#cardTypesPromise = fetch('http://localhost:8081/v1/cardTypes')
			.then(res => res.json())
			.then((/** @type {Array<any>} */ data) => {
				const cardTypes = data.map(item => new CardType(item));
				this.#cardTypesPromise = Promise.resolve(cardTypes);
				return cardTypes;
			});
		return this.#cardTypesPromise;
	}

	get actingPlayerID() { return this.#actingPlayerID; }

	getCardByID(/** @type {string} */ id) {
		return this.#cards.find(card => card.id === id);
	}

	/**
	 * @return {CardSlot}
	 */
	getSlot(/** @type {number} */ row, /** @type {number} */ col) {
		return this.#slots[row][col];
	}

	getSlots() {
		return this.#slots.flat();
	}

	/** @returns {GameLaneCollector} */
	getGameLaneCollector(/** @type {string} */ player, /** @type {number} */ row) {
		return this.#collectors[player][row];
	}

	/**
	 * @param {GameAction} gameAction
	 * @returns {Promise<GameActionResult>}
	 */
	act(gameAction) {
		if (gameAction instanceof RerollAction) {
			/** @type {Card[]} */
			const removeCards = [];
			gameAction.cardIds
				.forEach(cardId => {
					const card = this.#hand1.getCardByID(cardId);
					if (card) {
						removeCards.push(card);
					}
				});
			this.#hand1.addDelete(
				this.#cardSet1?.pop(gameAction.cardIds.length) || [],
				removeCards
			);
			this.#phase = GamePhases.PLAYER_1_TURN;
			this.emit(Game.EVENT_ACTION, gameAction);
			return Promise.resolve(new GameActionResult(true));
		}
		if (gameAction instanceof PassAction) {
			this.#actingPlayerID = gameAction.playerId === '1' ? '2' : '1';
			this.#actions.push(gameAction);
			this.#log?.append(new GameLog({
				message: 'Player pass'
			}));
			if (this.#actions.at(-1) instanceof PassAction &&
				this.#actions.at(-2) instanceof PassAction) {
				this.finalizeGame();
				return Promise.resolve(new GameActionResult(true));
			}
			this.emit(Game.EVENT_ACTION, gameAction);
			return Promise.resolve(new GameActionResult(true));
		}
		if (gameAction instanceof PlayCardAction) {
			const card = this.#cards.find(card => card.id === gameAction.cardId);
			if (!card) {
				return Promise.reject(new GameActionResult(false, ERROR_CODES.unknown_action));
			}
			const result = this.placeCard(gameAction.row, gameAction.col, card, gameAction.playerId);
			if (!result) {
				this.#actions.push(gameAction);
				this.#log?.append(new GameLog({
					message: 'Player card played'
				}));
				this.emit(Game.EVENT_ACTION, gameAction);
				return Promise.resolve(new GameActionResult(true));
			}
			return Promise.reject(new GameActionResult(false, result));
		}
		return Promise.reject(new GameActionResult(false, ERROR_CODES.unknown_action));
	}

	finalizeGame() {
		this.#log?.append(new GameLog({
			message: 'Game Complete'
		}));
	}

	getDestroyableCards() {
		return this.#slots.flat().map(slot => slot.card).filter(card => card && card?.power < 1);
	}

	/**
	 * @fires Game#card_played
	 * @return {String|undefined} Returns an error message if fails. Nothing if successful.
	 */
	placeCard(
    /** @type {number} */ row,
        /** @type {number} */ col,
        /** @type {Card} */ card,
        /** @type {string} */ playerId
	) {
		const slot = this.#slots[row][col];
		if (!this.#cardSet1 || !this.#cardSet2) {
			return ERROR_CODES.slot_occupied;
		}
		if (playerId !== this.#actingPlayerID) {
			return ERROR_CODES.not_active_player;
		}
		if (slot.card) {
			return ERROR_CODES.slot_occupied;
		}
		if (slot.player !== playerId) {
			return ERROR_CODES.not_player_controlled;
		}
		if (slot.pawnCount < card.cardType.pawnRequirement) {
			return ERROR_CODES.insufficient_pawns;
		}
		// apply "on play" effects
		// all cards less than 1, destroy
		// empty starting row gets a pawn
		// apply pawns to slots
		// apply "active" effects to played card
		// remove "active" effects from destroyed cards. destroy
		// apply "destroy" effects. destroy
		card.areas.forEach(([x, y, type]) => {
			x = x - 2;
			y = y - 2;
			if (type === CardAreaType.PAWN) {
				this.#slots[row + y]?.[col + x]?.change(1, playerId);
			}
			if (type === CardAreaType.AFFECT) {
				this.#slots[row + y]?.[col + x]?.addEffectsFromCard(playerId, card);
			}
		});
		this.#slots[row]?.[col]?.change(0, playerId, card);
		const collector = this.#collectors[playerId][row];
		collector.points += card.cardType.power;
		/**
		 * @event Game#card_played
		 */
		this.emit(Game.EVENT_CARD_PLAYED, {
			row,
			col,
			card
		});
		if (this.#actingPlayerID === '1') {
			this.#hand1.removeCard(card);
			this.#hand1.append(this.#cardSet1.pop(1));
		} else {
			this.#hand2.removeCard(card);
			this.#hand2.append(this.#cardSet2.pop(1));
		}
		this.#actingPlayerID = playerId === '1' ? '2' : '1';
		return undefined;
	}

	eventNames() {
		return [
			Game.EVENT_CARD_PLAYED,
			Game.EVENT_ACTION
		];
	}
}
