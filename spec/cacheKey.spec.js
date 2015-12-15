/* global beforeEach, describe, it */

'use strict';

const
	uuid = require('uuid'),
	xtend = require('xtend');

const expect = require('chai').expect;

const BrightspaceAuthToken = require('../');

describe('$cacheKey', function () {
	let baseClaims;
	beforeEach(function () {
		baseClaims = {
			sub: 123,
			tenantid: '66c0e49b-6ab4-4989-af8a-670194343608',
			scope: 'foo:bar:baz'
		};
	});

	it('should provide a consistent cache key for tokens, ignoring volatile claims', function () {
		const tokens = [100, 1000, 10000].map(function (dt) {
			const now = Date.now() / 1000 | 0;
			const claims = xtend(baseClaims, {
				exp: now + dt,
				iat: now - dt,
				nbf: now - dt,
				jti: uuid()
			});
			return new BrightspaceAuthToken(claims, 'x.y.z');
		});

		tokens.reduce(function (a, b) {
			a && expect(a.cacheKey).to.equal(b.cacheKey);
			return b;
		}, null);
	});

	it('should provide a consistent cache key for tokens, even when input json was ordered differently', function () {
		const tokens = [
			JSON.parse('{"sub":123,"tenantid":"66c0e49b-6ab4-4989-af8a-670194343608","scope":"foo:bar:baz"}'),
			JSON.parse('{"sub":123,"scope":"foo:bar:baz","tenantid":"66c0e49b-6ab4-4989-af8a-670194343608"}')
		].map(function (claims) {
			return new BrightspaceAuthToken(claims, 'x.y.z');
		});

		expect(tokens[0].cacheKey).to.equal(tokens[1].cacheKey);
	});

	describe('different non-volatile claims should result in a different cache key', function () {
		function runTest (fn) {
			const tokens = [null, null, null].map(function () {
				const claims = xtend(baseClaims, fn());
				return new BrightspaceAuthToken(claims, 'x.y.z');
			});

			for (const a of tokens) {
				for (const b of tokens) {
					if (a !== b) {
						expect(a.cacheKey).to.not.equal(b.cacheKey);
					}
				}
			}
		}

		it('sub', function () {
			runTest(function () {
				return {
					sub: uuid()
				};
			});
		});

		it('tenantid', function () {
			runTest(function () {
				return {
					tenantid: uuid()
				};
			});
		});

		it('scope', function () {
			runTest(function () {
				return {
					scope: `foo:bar:baz ${uuid()}:${uuid()}:${uuid()}`
				};
			});
		});

		it('a new claim', function () {
			runTest(function () {
				return {
					[uuid()]: uuid()
				};
			});
		});
	});
});
