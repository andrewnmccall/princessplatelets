import EventEmitter from './EventEmitter.js';

export default class Deck extends EventEmitter {
	/** @type {string=} */ id;
	/** @type {string=} */ name;
}
