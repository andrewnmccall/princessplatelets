import EventEmitter from './core/EventEmitter.js';

// let EventEmitterMixin = (superclass) => class extends EventEmitter { };

export const ERROR_CODES = {
	unknown_action: 'unknown_action',
	not_player_controlled: 'not_player_controllled',
	slot_occupied: 'slot_occupied',
	not_active_player: 'not_active_player',
	insufficient_pawns: 'insufficient_pawns'
};

/**
 * @enum {string}
 */
export const CardEffectTarget = {
	ALL: 'all',
	ALLY: 'ally',
	ENEMY: 'enemy'
};

/**
 * @enum {string}
 */
export const CardAreaType = {
	PAWN: 'pawn',
	AFFECT: 'affect'
};
export const CardAreaTrigger = {
	ACTIVE: 'pawn',
	ON_SELF_DESTROY: 'pawn',
	ON_ENEMY_DESTROY: 'pawn',
	ON_ALLY_DESTROY: 'pawn',
	ON_OTHER_DESTROY: 'pawn',
	ON_ANY_DESTROY: 'pawn',
	ON_FIRST_ENHANCE: 'pawn',
	ON_FIRST_ENFEEBLE: 'pawn',
	ON_ENHANCE_TO_7: 'pawn',
	// 2 separate effects
	ENHANCED_ENFEEBLE: 'pawn',
	LANE_WIN: 'pawn',
	GAME_END: 'pawn',
	ON_PLAY: 'affect'
};
export class CardEffect {
	/** @type {CardEffectTarget=} */ target;
	/** @type {number=} */ power;
	/** @type {string[]=} */ addCards;
	/** @type {string[]=} */ trigger;
}
export class CardType extends EventEmitter {
	/** @type {string} */
	name = 'Unknown';
	key = 'key';
	/** @type {boolean} */
	replacer = false;
	/** @type {number} */
	power = 1;
	/** @type {number} */
	pawnRequirement = 1;
	/**
	* @typedef {number} columnIndex
	* @typedef {number} rowIndex
	* @typedef {CardAreaType} areaType
	* @typedef {[columnIndex, rowIndex, areaType]} AreaTuple
	* @type {AreaTuple[]}
	*/
	areas = [];
	/** @type {CardEffect|undefined} */
	effect = undefined;
	constructor (attrs = {}) {
		super();
		Object.assign(this, attrs);
	}

	/** @returns {AreaTuple[]} */
	getAreas (invertX = false, invertY = false) {
		if (invertX || invertY) {
			return this.areas.map(areaTuple => [
				invertX ? -1 * (areaTuple[0] - 4) : areaTuple[0],
				invertY ? -1 * (areaTuple[1] - 4) : areaTuple[1],
				areaTuple[2]
			]);
		}
		return this.areas;
	}
};

const cardTypeData = {
	soldier: {
		name: 'Soldier',
		power: 1,
		pawnRequirement: 1,
		areas: [
			[2, 1, 'pawn'],
			[1, 2, 'pawn'],
			[3, 2, 'pawn'],
			[2, 3, 'pawn']
		]
	},
	guard: {
		name: 'Guard',
		power: 3,
		pawnRequirement: 2,
		areas: [
			[2, 0, 'pawn'],
			[2, 1, 'pawn'],
			[3, 2, 'pawn'],
			[2, 3, 'pawn'],
			[2, 4, 'pawn']
		]
	},
	ranger: {
		name: 'Ranger',
		power: 1,
		pawnRequirement: 2,
		areas: [
			[4, 2, 'affect']
		],
		effect: {
			target: 'enemy',
			power: -4
		}
	},
	tank: {
		name: 'Tank',
		power: 2,
		pawnRequirement: 2,
		areas: [
			[2, 1, 'pawn'],
			[3, 1, 'pawn'],
			[2, 3, 'pawn'],
			[3, 3, 'pawn']
		]
	},
	stringer: {
		name: 'Stinger',
		power: 1,
		pawnRequirement: 1,
		areas: [
			[2, 0, 'pawn'],
			[2, 4, 'pawn']
		]
	},
	vermin: {
		name: 'Vermin',
		power: 2,
		pawnRequirement: 2,
		areas: [
			[2, 3, 'pawn'],
			[3, 3, 'pawn'],
			[3, 3, 'affect']
		],
		effect: {
			target: 'all',
			power: -3
		}
	},
	ostrich: {
		name: 'Ostrich',
		power: 2,
		pawnRequirement: 1,
		areas: [
			[3, 2, 'pawn'],
			[2, 3, 'pawn']
		]
	},
	wolf: {
		name: 'Wolf',
		power: 2,
		pawnRequirement: 1,
		areas: [
			[2, 1, 'pawn'],
			[3, 2, 'pawn']
		]
	},
	chipmunk: {
		name: 'Chipmunk',
		power: 1,
		pawnRequirement: 2,
		areas: [
			[3, 1, 'pawn'],
			[3, 2, 'pawn'],
			[2, 3, 'affect']
		],
		effect: {
			target: 'ally',
			power: 1
		}
	},
	parslemon: {
		name: 'Parslemon',
		power: 1,
		pawnRequirement: 1,
		areas: [
			[2, 3, 'pawn'],
			[3, 2, 'pawn']
		],
		effect: {
			addCards: [
				'Parslemon Seedling'
			]
		}
	},
	eletrunky: {
		name: 'Eletrunky',
		power: 4,
		pawnRequirement: 2,
		areas: [
			[2, 1, 'pawn'],
			[1, 2, 'pawn'],
			[2, 3, 'pawn']
		]
	},
	spiny: {
		name: 'Spiny',
		power: 1,
		pawnRequirement: 1,
		areas: [
			[3, 2, 'pawn'],
			[2, 3, 'pawn'],
			[3, 4, 'affect']
		]
	},
	crab: {
		name: 'Crab',
		power: 1,
		pawnRequirement: 1,
		areas: [
			[1, 2, 'pawn'],
			[2, 1, 'pawn'],
			[3, 2, 'pawn'],
			[2, 1, 'affect']
		],
		effect: {
			target: 'ally',
			power: 2
		}
	},
	q: {
		name: 'Q',
		power: 3,
		pawnRequirement: 2,
		areas: [
			[2, 0, 'pawn'],
			[3, 1, 'pawn'],
			[3, 3, 'pawn'],
			[2, 4, 'pawn']
		]
	},
	zu: {
		name: 'Zu',
		power: 2,
		pawnRequirement: 2,
		areas: [
			[1, 1, 'pawn'],
			[3, 1, 'pawn'],
			[1, 3, 'pawn'],
			[3, 3, 'pawn']
		]
	},
	biker: {
		name: 'Biker',
		power: 4,
		pawnRequirement: 2,
		areas: [
			[0, 1, 'pawn'],
			[0, 2, 'pawn'],
			[1, 2, 'pawn'],
			[0, 3, 'pawn']
		]
	},
	shouter: {
		name: 'Shouter',
		power: 1,
		pawnRequirement: 3,
		areas: [
			[1, 1, 'pawn'],
			[1, 2, 'pawn'],
			[1, 3, 'pawn'],
			[2, 1, 'pawn'],
			[2, 3, 'pawn'],
			[3, 1, 'pawn'],
			[3, 2, 'pawn'],
			[3, 3, 'pawn']
		]
	},
	flan: {
		name: 'Flan',
		power: 2,
		pawnRequirement: 1,
		areas: [
			[1, 1, 'pawn'],
			[1, 2, 'pawn'],
			[1, 3, 'pawn']
		]
	},
	floorer: {
		name: 'Floorer',
		power: 2,
		pawnRequirement: 1,
		areas: [
			[1, 1, 'pawn'],
			[2, 1, 'pawn'],
			[1, 3, 'pawn'],
			[2, 3, 'pawn']
		]
	}
};
export const /** @type {CardType[]} */ cardTypes = [
];
Object.entries(cardTypeData).forEach(([key, item]) => cardTypes.push(new CardType(Object.assign({ key }, item))));

export class Card extends EventEmitter {
	/** @type {symbol} */ static EVENT_CHANGE = Symbol('change');
	/** @type {string} */
	id;
	/** @type {Object.<string, CardEffect[]>} */ #effects = {};
	/** @type {CardType} */
	cardType;

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
};
export class CardSlot extends EventEmitter {
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
		row,
		col,
		pawnCount,
		player
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
		/** @type {string} */player,
		/** @type {?Card} */card
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
		/** @type {string} */playerId,
		/** @type {Card} */card
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
					if (
						cardEffect.target === CardEffectTarget.ENEMY &&
						playerId === this.#player
					) {
						return false;
					}
					return true;
				});
				this.#card?.setEffects(cardId, effects);
			});
		});
	}
};

export class CardSet extends EventEmitter {
	static EVENT_CHANGED = Symbol('changed');

	/** @type {Card[]} */
	cards = [];

	pushCard (/** @type {Card} */ card) {

	}

	removeCard (/** @type {Card} */ card) {
		const idx = this.cards.indexOf(card);
		this.card = this.cards.splice(idx, 1);
		this.emit(CardSet.EVENT_CHANGED, {
			removed: [card],
			added: [],
			set: this
		});
	}

	getCardByID (/** @type {string} */ id) {
		return this.cards.find(card => card.id === id);
	}

	pop (count = 1) {
		const out = this.cards.splice(0, count);
		this.emit(CardSet.EVENT_CHANGED, {
			removed: out,
			added: [],
			set: this
		});
		return out;
	}

	addDelete (
		/** @type {Card[]} */ add,
		/** @type {Card[]} */ drop
	) {
		const added = add.filter(card => !this.cards.some(card2 => card.id === card2.id));
		this.cards = this.cards.filter(card => !drop.some(card2 => card.id === card2.id));
		this.cards.push(...added);
		this.emit(CardSet.EVENT_CHANGED, {
			removed: drop,
			added,
			set: this
		});
	}

	append (/** @type {Card[]} */ cards) {
		this.cards.push(...cards);
		this.emit(CardSet.EVENT_CHANGED, {
			removed: [],
			added: cards,
			set: this
		});
	}

	shuffle () {
		const array = this.cards;
		let currentIndex = array.length;

		// While there remain elements to shuffle...
		while (currentIndex !== 0) {
			// Pick a remaining element...
			const randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]];
		}
	}

	eventNames () {
		return [
			CardSet.EVENT_CHANGED
		];
	}
};

export class GameLog {
	/** @type {string} */ message = '';
	constructor (/** @type {GameLog} */ args) {
		this.message = args.message;
	}
}

export class GameLogCollection extends EventEmitter {
	static EVENT_APPEND = Symbol('append');
	/** @type {GameLog[]} */ #logs = [];
	append (/** @type {GameLog} */ log) {
		this.#logs.push(log);
		this.emit(GameLogCollection.EVENT_APPEND, { item: log });
	}

	eventNames () {
		return [
			GameLogCollection.EVENT_APPEND
		];
	}
}

export class GameLaneCollector extends EventEmitter {
	static EVENT_CHANGED = Symbol('changed');
	#points = 0;
	#modifier = 0;
	get points () { return this.#points; }
	set points (val) {
		this.#points = val;
		this.emit(GameLaneCollector.EVENT_CHANGED);
	}

	get modifier () { return this.#modifier; }
	set modifier (val) {
		this.#modifier = val;
		this.emit(GameLaneCollector.EVENT_CHANGED);
	}

	eventNames () {
		return [
			GameLaneCollector.EVENT_CHANGED
		];
	}
}

export class GameAgent extends EventEmitter {
	/** @type {Game} */ #game;
	/** @type {string} */ #playerID;

	constructor (
		/** @type {Game} */ game,
		/** @type {string} */ playerID
	) {
		super();
		this.#game = game;
		this.#playerID = playerID;
		this.#game.on(
			Game.EVENT_ACTION,
			(/** @type {any} */ args) => this.onGameAction(args)
		);
	}

	onGameAction (
		/** @type {GameAction} */ args
	) {
		if (
			args instanceof PlayCardAction ||
			args instanceof PassAction
		) {
			if (args.playerId === this.#playerID) {
				return;
			}
			console.log('I can do something!');
			let playCardAction;
			this.#game.hand2.cards.find(card => {
				const slot = this.#game.getSlots().find(slot => {
					return slot.playerID === this.#playerID &&
						card.cardType.pawnRequirement <= slot.pawnCount &&
						!slot.card;
				});
				if (!slot) {
					return false;
				}
				playCardAction = Object.assign(new PlayCardAction(), {
					row: slot.row,
					col: slot.col,
					cardId: card.id,
					playerId: this.#playerID
				});
				return true;
			});
			if (playCardAction) {
				this.#game.act(playCardAction)
					.then(action => console.log(action.success ? 'I can play it' : 'I can not play it'))
					.catch(() => {
						const action = Object.assign(new PassAction(), {
							playerId: this.#playerID
						});
						this.#game.act(action);
					});
			} else {
				const action = Object.assign(new PassAction(), {
					playerId: this.#playerID
				});
				this.#game.act(action);
			}
		}
	}
}
export class GameAction {
	/** @type {string} */ action = 'unknown';
}
export class GameError {
	/** @type {string} */ code = '';
	/** @type {string} */ title = '';
	/** @type {string} */ detail = '';
}
export class PassAction extends GameAction {
	/** @type {string} */ action = 'pass';
	/** @type {string} */ playerId = '';
}
export class PlayCardAction extends GameAction {
	/** @type {string} */ action = 'play_card';
	/** @type {number} */ row = 0;
	/** @type {number} */ col = 0;
	/** @type {string} */ playerId = '';
	/** @type {string} */ cardId = '';
}
export class RerollAction extends GameAction {
	/** @type {string} */ action = 'reroll';
	/** @type {string} */ playerId = '';
	/** @type {String[]} */ cardIds = [];
}

export class GameActionResult {
	/** @type {Boolean} */ success = true;
	/** @type {String|undefined} */ errorCode = undefined;
	constructor (
		/** @type {Boolean} */ success,
		/** @type {String|undefined} */ errorCode = undefined
	) {
		this.success = success;
		this.errorCode = errorCode;
	}
}

/**
 * @readonly
 * @enum {string}
 */
export const GamePhases = {
	/** The true value */
	REROLL: 'REROLL',
	PLAYER_1_TURN: 'PLAYER_1_TURN',
	PLAYER_2_TURN: 'PLAYER_2_TURN',
	COMPLETE: 'COMPLETE'
};

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

	constructor () {
		super();
		this.getCardTypes();
		this.reset();
	}

	reset () {
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

	get cardSet1 () {
		return this.#cardSet1;
	}

	get phase () { return this.#phase; }
	get hand1 () { return this.#hand1; }

	get hand2 () { return this.#hand2; }
	get log () { return this.#log; }

	get cardSet2 () {
		return this.#cardSet2;
	}

	/** @return {Promise<CardType[]>} */ getCardTypes () {
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

	get actingPlayerID () { return this.#actingPlayerID; }

	getCardByID (/** @type {string} */ id) {
		return this.#cards.find(card => card.id === id);
	}

	/**
	 * @return {CardSlot}
	 */
	getSlot (/** @type {number} */ row, /** @type {number} */ col) {
		return this.#slots[row][col];
	}

	getSlots () {
		return this.#slots.flat();
	}

	/** @returns {GameLaneCollector} */
	getGameLaneCollector (/** @type {string} */ player, /** @type {number} */ row) {
		return this.#collectors[player][row];
	}

	/**
	 * @param {GameAction} gameAction
	 * @returns {Promise<GameActionResult>}
	 */
	act (gameAction) {
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
			if (
				this.#actions.at(-1) instanceof PassAction &&
				this.#actions.at(-2) instanceof PassAction
			) {
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

	finalizeGame () {
		this.#log?.append(new GameLog({
			message: 'Game Complete'
		}));
	}

	getDestroyableCards () {
		return this.#slots.flat().map(slot => slot.card).filter(card => card && card?.power < 1);
	}

	/**
	 * @fires Game#card_played
	 * @return {String|undefined} Returns an error message if fails. Nothing if successful.
	 */
	placeCard (
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

	eventNames () {
		return [
			Game.EVENT_CARD_PLAYED,
			Game.EVENT_ACTION
		];
	}
};
