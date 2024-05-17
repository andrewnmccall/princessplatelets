import { Game } from './Game.js';
import EventEmitter from './EventEmitter.js';
import { PlayCardAction, PassAction, GameAction } from '../core.js';

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
		if (args instanceof PlayCardAction ||
			args instanceof PassAction) {
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
