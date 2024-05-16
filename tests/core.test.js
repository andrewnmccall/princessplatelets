import {expect, jest, test, describe} from '@jest/globals';
import assert from 'assert';

import {Crypto} from '@peculiar/webcrypto';
globalThis.crypto = new Crypto();

import {Card, CardAreaTrigger, CardEffect, CardEffectTarget, CardSlot, cardTypes} from '../public/js/core.js';
describe('core.js', () => {
	describe('Card', () => {
		describe('setEffects', () => {
			test('power, powerBase, & powerAugment change based on effects', () => {
				const card = new Card({ cardType: cardTypes[0]});
				const cardEffect = Object.assign(new CardEffect(), {
					power: 3
				});
				assert.equal(card.power, 1);
				assert.equal(card.powerBase, 1);
				assert.equal(card.powerAugment, 0);
				card.setEffects('2', [
					cardEffect
				]);
				assert.equal(card.power, 4);
				assert.equal(card.powerBase, 1);
				assert.equal(card.powerAugment, 3);
			});
		});
	});
	
	describe('CardSlot', () => {
		describe('change', () => {
			test('added effects apply to added card', () => {
				const card = new Card({ cardType: cardTypes[0]});
				const cardSlot = new CardSlot({row: 1, col: 1})
				const cardEffect = Object.assign(new CardEffect(), {
					power: -3
				});
				cardSlot.addEffects('1', 'cardId', [cardEffect]);
				cardSlot.change(
					0,
					'2',
					card
				);
				assert.equal(card.power, -2);
				assert.equal(card.powerBase, 1);
				assert.equal(card.powerAugment, -3);
			});
			test('added effects apply to existing card', () => {
				const card = new Card({ cardType: cardTypes[0]});
				const cardSlot = new CardSlot({row: 1, col: 1})
				const cardEffect = Object.assign(new CardEffect(), {
					power: -3
				});
				cardSlot.change(
					0,
					'2',
					card
				);
				cardSlot.addEffects('1', 'cardId', [cardEffect]);
				assert.equal(card.power, -2);
				assert.equal(card.powerBase, 1);
				assert.equal(card.powerAugment, -3);
			});
			test('properly handles target field', () => {
				const card = new Card({ cardType: cardTypes[0]});
				const cardSlot = new CardSlot({row: 1, col: 1})
				const cardEffect = Object.assign(new CardEffect(), {
					target: CardEffectTarget.ENEMY,
					power: -3
				});
				cardSlot.addEffects('1', 'cardId', [cardEffect]);
				cardSlot.change(
					0,
					'2',
					card
				);
				assert.equal(card.power, -2);
				assert.equal(card.powerBase, 1);
				assert.equal(card.powerAugment, -3);
			});
		});
	});
});
