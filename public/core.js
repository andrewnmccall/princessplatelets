export default class EventEmitter {
	/** @type {Object.<symbol, function[]} */
	#listeners = {};

	eventNames () {
		return [];
	}

	emit (eventName, args) {
		if (this.eventNames().indexOf(eventName) < 0) {
			if (typeof eventName === 'symbol') {
				eventName = eventName.toString();
			}
			throw new Error('Unregistered event: ' + eventName);
		}
		this.#listeners[eventName]?.forEach(cb => cb(args));
	}

	on (eventName, callback) {
		if (this.eventNames().indexOf(eventName) < 0) {
			if (typeof eventName === 'symbol') {
				eventName = eventName.toString();
			}
			throw new Error('Unregistered event: ' + eventName);
		}
		this.#listeners[eventName] = this.#listeners[eventName] ?? [];
		this.#listeners[eventName].push(callback);
	}
};

// let EventEmitterMixin = (superclass) => class extends EventEmitter { };

export const ERROR_CODES = {
	unknown_action: 'unknown_action',
	not_player_controlled: 'not_player_controllled',
	slot_occupied: 'slot_occupied',
	insufficient_pawns: 'insufficient_pawns',
};

// Create a class for the element
export class CardType extends EventEmitter {
	/** @type {string} */
	name;
	/** @type {boolean} */
	replacer = false;
	/** @type {number} */
	power = 1;
	/** @type {number} */
	pawnRequirement = 1;
	/** @type {[][]} */
	areas = [];
	/** @type {Object|undefined} */
	effect = undefined;
	constructor (attrs = {}) {
		super();
		Object.assign(this, attrs);
	}

	getAreas (invertX = false, invertY = false) {
		return this.areas;
	}
};

const cardTypeData = [
	{
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
	{
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
	{
		name: 'Ranger',
		power: 1,
		pawnRequirement: 2,
		areas: [
			[4, 2, 'affect']
		],
		effect: {
			target: 'enemy',
			power: '-4'
		}
	},
	{
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
	{
		name: 'Stinger',
		power: 1,
		pawnRequirement: 1,
		areas: [
			[2, 0, 'pawn'],
			[2, 4, 'pawn']
		]
	},
	{
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
			power: '-3'
		}
	},
	{
		name: 'Ostrich',
		power: 2,
		pawnRequirement: 1,
		areas: [
			[3, 2, 'pawn'],
			[2, 3, 'pawn']
		]
	},
	{
		name: 'Wolf',
		power: 2,
		pawnRequirement: 1,
		areas: [
			[2, 1, 'pawn'],
			[3, 2, 'pawn']
		]
	},
	{
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
			power: '+1'
		}
	},
	{
		name: 'Parslemon',
		power: 1,
		pawnRequirement: 1,
		areas: [
			[2, 3, 'pawn'],
			[3, 2, 'pawn']
		],
		effect: {
			addCard: [
				'Parslemon Seedling'
			]
		}
	},
	{
		name: 'Eletrunky',
		power: 4,
		pawnRequirement: 2,
		areas: [
			[2, 1, 'pawn'],
			[1, 2, 'pawn'],
			[2, 3, 'pawn']
		]
	},
	{
		name: 'Spiny',
		power: 1,
		pawnRequirement: 1,
		areas: [
			[3, 2, 'pawn'],
			[2, 3, 'pawn'],
			[3, 4, 'affect']
		]
	},
	{
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
			power: '+2'
		}
	},
	{
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
	{
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
	{
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
	{
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
	{
		name: 'Flan',
		power: 2,
		pawnRequirement: 1,
		areas: [
			[1, 1, 'pawn'],
			[1, 2, 'pawn'],
			[1, 3, 'pawn']
		]
	},
	{
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
	// {
	// 	name: 'Name',
	// 	power: 1,
	// 	pawnRequirement: 1,
	// 	areas: [
	// 		[2, 0, 'pawn'],
	// 	]
	// },
	// {
	// 	name: 'Name',
	// 	power: 1,
	// 	pawnRequirement: 1,
	// 	areas: [
	// 		[2, 0, 'pawn'],
	// 		[2, 4, 'pawn']
	// 	]
	// },
];
const cardTypes = [
];
cardTypeData.forEach(item => cardTypes.push(new CardType(item)));

export class Card {
	id;
	/** @type {CardType} */
	cardType;
	constructor (attrs = {}) {
		this.id = attrs.id ?? crypto.randomUUID();
		this.cardType = attrs.cardType;
	}
};

export class CardSlot extends EventEmitter {
	/** @type {Symbol} */ static EVENT_CHANGE = Symbol('change');
	#row;
	#col;
	#card;
	#pawnCount = 0;
	/** @type {String|undefined} */ #player = undefined;
	constructor (attrs = {}) {
		super();
		this.#row = attrs.row;
		this.#col = attrs.col;
		this.#pawnCount = attrs.pawnCount ?? 0;
		this.#player = attrs.player;
	}

	/** @return {Number} */
	get pawnCount () {
		return this.#pawnCount;
	}

	/** @return {Card} */
	get card () {
		return this.#card;
	}

	/** @return {String|undefined} */
	get player () {
		return this.#player;
	}

	/** @return {String|undefined} */
	get playerID () {
		return this.#player;
	}

	get row() { return this.#row }
	get col() { return this.#col }

	change (pawnCountInc, player, card) {
		this.#pawnCount = this.#pawnCount + pawnCountInc;
		this.#player = player;
		if (card || card === false) {
			this.#card = card;
		}
		this.emit(CardSlot.EVENT_CHANGE, {});
	}

	eventNames () {
		return [
			CardSlot.EVENT_CHANGE
		];
	}
};

export class CardSet extends EventEmitter {
	static EVENT_CHANGED = Symbol('changed');
	id;
	/** @type {Card[]} */
	cards = [];

	pushCard (card) {

	}

	removeCard (card) {
		const idx = this.cards.indexOf(card);
		this.card = this.cards.splice(idx, 1);
		this.emit(CardSet.EVENT_CHANGED, {
			removed: [card],
			added: [],
			set: this
		});
	}

	onCardsChange (callback) {

	}

	getCardByID (id) {
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

	append (/** @type {Card[]} */ cards) {
		this.cards.push(...cards);
		this.emit(CardSet.EVENT_CHANGED, {
			removed: [],
			added: cards,
			set: this
		});
	}

	shuffle() {
		const array = this.cards;
		let currentIndex = array.length;
	
		// While there remain elements to shuffle...
		while (currentIndex != 0) {
	
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

const source = new CardSet();
const source2 = new CardSet();
cardTypes.forEach(cardType => {
	source.cards.push(
		new Card({ cardType })
	);
	source2.cards.push(
		new Card({ cardType })
	);
});
source.shuffle();
source2.shuffle();

export class GameLaneCollector extends EventEmitter {
	#points = 0;
	#modifier = 0;
	get points () { return this.#points; }
	set points (val) {
		this.#points = val;
		this.emit('change');
	}

	get modifier () { return this.#modifier; }
	set modifier (val) {
		this.#modifier = val;
		this.emit('change');
	}

	eventNames () {
		return [
			'change'
		];
	}
}
export class GameAgent extends EventEmitter {
	/** @type {Game} */ #game;
	/** @type {String} */ #playerID;

	constructor (
		/** @type {Game} */ game,
		/** @type {String} */ playerID
	) {
		super();
		this.#game = game;
		this.#playerID = playerID;
		this.#game.on(Game.EVENT_ACTION, args => this.onGameAction(args));
	}

	onGameAction (
		/** @type {GameAction} */ args
	) {
		if (args instanceof PlayCardAction) {
			if (args.playerId === this.#playerID) {
				return;
			}
			console.log('I can do something!');
			const card = this.#game.hand2.cards.find(card => {
				const slot = this.#game.getSlots().find(slot => {
					return slot.playerID === this.#playerID
						&& card.cardType.pawnRequirement <= slot.pawnCount
						&& !slot.card;
				});
				if (!slot) {
					return false;
				}
				const playCardAction = Object.assign(new PlayCardAction(), {
					row: slot.row,
					col: slot.col,
					cardId: card.id,
					playerId: this.#playerID
				});
				this.#game.act(playCardAction)
					.then(action => console.log(action.success ? 'I can play it' : 'I can not play it'));
				return true;
			});
			if (!card) {
				const action = Object.assign(new PassAction(), {
					playerId: this.#playerID
				});
				this.#game.act(action);
			}
		}
	}
}
export class GameAction {
	/** @type {String} */ action = 'unknown';
}
export class GameError {
	/** @type {String} */ code = '';
	/** @type {String} */ title = '';
	/** @type {String} */ detail = '';
}
export class PassAction extends GameAction {
	/** @type {String} */ action = 'pass';
	/** @type {String} */ playerId = '';
}
export class PlayCardAction extends GameAction {
	/** @type {String} */ action = 'play_card';
	/** @type {Number} */ row = 0;
	/** @type {Number} */ col = 0;
	/** @type {String} */ playerId = '';
	/** @type {String} */ cardId = '';
}

export class GameActionResult {
	/** @type {Boolean} */ success = true;
	/** @type {String|undefined} */ errorCode = true;
	constructor (
		/** @type {Boolean} */ success,
		/** @type {String|undefined} */ errorCode = undefined
	) {
		this.success = success;
		this.errorCode = errorCode;
	}
}

export class Game extends EventEmitter {
	/** @type {Symbol} */ static EVENT_CARD_PLAYED = Symbol('card_played');
	/** @type {Symbol} */ static EVENT_ACTION = Symbol('action');

	/** @type {Card[]} */ #cards = [];
	/** @type {CardSet} */ #cardSet1;
	/** @type {CardSet} */ #hand1 = new CardSet();
	/** @type {CardSet} */ #cardSet2;
	/** @type {CardSet} */ #hand2 = new CardSet();
	/** @type {String} */ #actingPlayerID = '1';
	/** @type {GameAgent} */ #player2GameAgent;
	/** @type {CardSlot[][]} */
	#slots = [
		new Array(5),
		new Array(5),
		new Array(5)
	];

	/** @type {GameLaneCollector[][]} */
	#collectors = [
	];

	/** @type {Promise<CardTypes[]>} */ #cardTypesPromise;

	constructor () {
		super();
		this.getCardTypes();
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
		this.#collectors[0] = [
			new GameLaneCollector(),
			new GameLaneCollector(),
			new GameLaneCollector()
		];
		this.#collectors[1] = [
			new GameLaneCollector(),
			new GameLaneCollector(),
			new GameLaneCollector()
		];
		this.#player2GameAgent = new GameAgent(this, '2');
	}

	get cardSet1 () {
		return this.#cardSet1;
	}

	get hand1 () { return this.#hand1; }

	get hand2 () { return this.#hand2; }

	get cardSet2 () {
		return this.#cardSet2;
	}

	/** @return {Promise<CardType>} */ getCardTypes () {
		if (this.#cardTypesPromise) {
			return this.#cardTypesPromise;
		}
		this.#cardTypesPromise = fetch('http://localhost:8081/v1/cardTypes')
			.then(res => res.json)
			.then(data => {
				this.#cardTypesPromise = Promise.resolve(data);
				return data;
			});
		return this.#cardTypesPromise;
	}

	get actingPlayerID () { return this.#actingPlayerID; }

	getCardByID (/** @type {String} */ id) {
		return this.#cards.find(card => card.id === id);
	}

	/**
	 * @return {CardSlot}
	 */
	getSlot (row, col) {
		return this.#slots[row][col];
	}

	getSlots () {
		return this.#slots.flat();
	}

	/** @returns {GameLaneCollector} */
	getGameLaneCollector (player, row) {
		return this.#collectors[player][row];
	}

	/**
	 * @param {GameAction} gameAction
	 * @returns {Promise<GameActionResult>}
	 */
	act (gameAction) {
		if (gameAction instanceof PlayCardAction) {
			const card = this.#cards.find(card => card.id === gameAction.cardId);
			const result = this.placeCard(gameAction.row, gameAction.col, card, gameAction.playerId);
			if (!result) {
				this.emit(Game.EVENT_ACTION, gameAction);
				return Promise.resolve(new GameActionResult(true));
			}
			return Promise.reject(new GameActionResult(false, result));
		}
		return Promise.reject(new GameActionResult(false, ERROR_CODES.unknown_action));
	}

	/**
	 * @fires Game#card_played
	 * @param {Card} card
	 * @return {String|undefined} Returns an error message if fails. Nothing if successful.
	 */
	placeCard (row, col, card, playerId) {
		const slot = this.#slots[row][col];
		if (playerId !== this.#actingPlayerID) {
			return ERROR_CODES.slot_occupied;
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
		card.cardType.areas.forEach(([x, y, type]) => {
			if (type === 'pawn') {
				x = x - 2;
				y = y - 2;
				this.#slots[row + y]?.[col + x]?.change(1, playerId);
			}
		});
		this.#slots[row]?.[col]?.change(0, 1, card);
		this.#collectors[0][row].points += card.cardType.power;
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
		this.#actingPlayerID = this.#actingPlayerID === '1' ? '2' : '1'; 
		return undefined;
	}

	eventNames () {
		return [
			Game.EVENT_CARD_PLAYED,
			Game.EVENT_ACTION
		];
	}
};
