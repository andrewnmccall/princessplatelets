import EventEmitter from './EventEmitter.js';

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
