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

;
;

;

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

;
