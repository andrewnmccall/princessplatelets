export default class EventEmitter {
	/** @type {Object.<symbol, function[]} */
	#listeners = {};

	eventNames () {
		return [];
	}

	emit (eventName, args) {
		if (this.eventNames().indexOf(eventName) < 0) {
			throw new Error('Unregistered event: ' + eventName);
		}
		this.#listeners[eventName].forEach(cb => cb(args));
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
	#row;
	#col;
	#card;
	#pawnCount = 0;
	#player = undefined;
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

	/** @return {Number|undefined} */
	get player () {
		return this.#player;
	}

	change (pawnCountInc, player, card) {
		this.#pawnCount = this.#pawnCount + pawnCountInc;
		this.#player = player;
		if (card || card === false) {
			this.#card = card;
		}
		this.emit('change', {});
	}

	eventNames () {
		return [
			'change'
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

	constructor (
		/** @type {Game} */ game,
		/** @type {String} */ playerId
	) {
		super();
		this.#game = game;
		this.#game.on(Game.EVENT_ACTION, args => this.onGameAction(args));
	}

	onGameAction (
		/** @type {GameAction} */ args
	) {
		if (args instanceof PlayCardAction) {
			console.log('I can do something!');
			if (args.playerId === 2) {
				return;
			}
			const card = this.#game.cardSet2.cards[0];
			const playCardAction = Object.assign(new PlayCardAction(), {
				row: 0,
				col: 4,
				cardId: card.id,
				playerId: 2
			});
			this.#game.act(playCardAction)
				.then(action => console.log(action.success ? 'I can play it' : 'I can not play it'));
		}
	}
}
export class GameAction {
	/** @type {String} */ action = 'unknown';
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
	constructor (
		/** @type {Boolean} */ success
	) {
		this.success = success;
	}
}

export class Game extends EventEmitter {
	/** @type {Symbol} */ static EVENT_CARD_PLAYED = Symbol('card_played');
	/** @type {Symbol} */ static EVENT_ACTION = Symbol('action');

	/** @type {Card[]} */ #cards = [];
	/** @type {CardSet} */ #cardSet1;
	/** @type {CardSet} */ #cardSet2;
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

	constructor () {
		super();
		this.#cardSet1 = source;
		this.#cardSet2 = source2;
		this.#cards = [
			...this.#cardSet1.cards,
			...this.#cardSet2.cards
		];
		for (let row = 0; row < 3; row++) {
			this.#slots[row][0] = new CardSlot({ row, col: 0, pawnCount: 1, player: 1 });
			this.#slots[row][1] = new CardSlot({ row, col: 1 });
			this.#slots[row][2] = new CardSlot({ row, col: 2 });
			this.#slots[row][3] = new CardSlot({ row, col: 3 });
			this.#slots[row][4] = new CardSlot({ row, col: 4, pawnCount: 1, player: 2 });
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
		this.#player2GameAgent = new GameAgent(this, '1');
	}

	get cardSet1 () {
		return this.#cardSet1;
	}

	get cardSet2 () {
		return this.#cardSet2;
	}

	getCardByID (/** @type {String} */ id) {
		return this.#cards.find(card => card.id === id);
	}

	/**
	 * @return {CardSlot}
	 */
	getSlot (row, col) {
		return this.#slots[row][col];
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
			if (this.placeCard(gameAction.row, gameAction.col, card, gameAction.playerId)) {
				this.emit(Game.EVENT_ACTION, gameAction);
				return Promise.resolve(new GameActionResult(true));
			}
		}
		return Promise.resolve(new GameActionResult(false));
	}

	/**
	 * @fires Game#card_played
	 * @param {Card} card
	 */
	placeCard (row, col, card, playerId) {
		const slot = this.#slots[row][col];
		if (slot.player !== playerId) {
			return false;
		}
		if (slot.pawnCount < card.cardType.pawnRequirement) {
			return false;
		}
		card.cardType.areas.forEach(([x, y, type]) => {
			if (type === 'pawn') {
				x = x - 2;
				y = y - 2;
				this.#slots[row + y]?.[col + x]?.change(1, 1);
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
		return true;
	}

	eventNames () {
		return [
			Game.EVENT_CARD_PLAYED,
			Game.EVENT_ACTION
		];
	}
};
