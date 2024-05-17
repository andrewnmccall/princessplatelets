import EventEmitter from './EventEmitter.js';


export class CardSet extends EventEmitter {
	static EVENT_CHANGED = Symbol('changed');

	/** @type {Card[]} */
	cards = [];

	pushCard(/** @type {Card} */ card) {
	}

	removeCard(/** @type {Card} */ card) {
		const idx = this.cards.indexOf(card);
		this.card = this.cards.splice(idx, 1);
		this.emit(CardSet.EVENT_CHANGED, {
			removed: [card],
			added: [],
			set: this
		});
	}

	getCardByID(/** @type {string} */ id) {
		return this.cards.find(card => card.id === id);
	}

	pop(count = 1) {
		const out = this.cards.splice(0, count);
		this.emit(CardSet.EVENT_CHANGED, {
			removed: out,
			added: [],
			set: this
		});
		return out;
	}

	addDelete(
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

	append(/** @type {Card[]} */ cards) {
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
		while (currentIndex !== 0) {
			// Pick a remaining element...
			const randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]
			];
		}
	}

	eventNames() {
		return [
			CardSet.EVENT_CHANGED
		];
	}
}
