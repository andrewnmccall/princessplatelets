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
	}
	// {
	// 	name: 'Name',
	// 	power: 1,
	// 	pawnRequirement: 1,
	// 	areas: [
	// 		[2, 0, 'pawn'],
	// 		[2, 4, 'pawn']
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
};

const source = new CardSet();
cardTypes.forEach(cardType => {
	source.cards.push(
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
export class Game extends EventEmitter {
	static EVENT_CARD_PLAYED = Symbol('card_played');
	#cardSet1;
	#cardSet2;
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
	}

	get cardSet1 () {
		return this.#cardSet1;
	}

	get cardSet2 () {
		return this.#cardSet2;
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
	 * @fires Game#card_played
	 * @param {Card} card
	 */
	placeCard (row, col, card) {
		const slot = this.#slots[row][col];
		if (slot.player !== 1) {
			return;
		}
		if (slot.pawnCount < card.cardType.pawnRequirement) {
			return;
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
	}

	eventNames () {
		return [
			Game.EVENT_CARD_PLAYED
		];
	}
};
