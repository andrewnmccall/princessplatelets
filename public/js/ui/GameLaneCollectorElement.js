import { GameLaneCollector } from '../core/GameLaneCollector.js';
import { Game } from '../core/Game.js';

export default class GameLaneCollectorElement extends HTMLElement {
	/** @type {Number} */ #row = 0;
	/** @type {String} */ #player;
	/** @type {?GameLaneCollector} */ #gameLaneCollector = null;
	/** @type {Game=} */ #game;

	/**
	 * @param {Object} props
	 * @param {Number} props.row
	 * @param {String} props.player
	 * @param {Array<String|HTMLElement>=} children
	 */
	constructor ({ row, player }, children = []) {
		super();
		this.#row = row;
		this.#player = player;
	}

	set game (/** @type {Game} */set) {
		this.#game = set;
		this.#gameLaneCollector = this.#game.getGameLaneCollector(
			this.#player,
			this.#row
		);
		this.#gameLaneCollector.on(GameLaneCollector.EVENT_CHANGED, () => this.build());
		this.build();
	}

	build () {
		this.innerHTML = `<table>
			<tr><th>Points</th><td>${this.#gameLaneCollector?.points}</td><tr>
			<tr><th>Mod</th><td>${this.#gameLaneCollector?.modifier}</td><tr>
		</table>`;
	}
}
