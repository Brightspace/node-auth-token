/* global describe, it */

'use strict';

const expect = require('chai').expect;

const BrightspaceAuthToken = require('../');

describe('Claims', function() {
	describe('user', function() {
		it('should expose "sub"', function() {
			const token = new BrightspaceAuthToken({
				sub: '169'
			}, 'x.y.z');

			expect(token.user).to.equal('169');
		});

		it('should be "undefined" when there is no "sub"', function() {
			const token = new BrightspaceAuthToken({}, 'x.y.z');

			expect(token.user).to.be.undefined;
		});
	});

	describe('tenant', function() {
		it('should expose "tenantid"', function() {
			const token = new BrightspaceAuthToken({
				tenantid: 'foozleberries'
			}, 'x.y.z');

			expect(token.tenant).to.equal('foozleberries');
		});

		it('should be "undefined" when there is no "tenantid"', function() {
			const token = new BrightspaceAuthToken({}, 'x.y.z');

			expect(token.tenant).to.be.undefined;
		});
	});

	describe('actualUser', function() {
		it('should expose "actualsub"', function() {
			const token = new BrightspaceAuthToken({
				sub: '123',
				actualsub: '456'
			}, 'x.y.z');

			expect(token.actualUser).to.equal('456');
		});

		it('should expose "sub" when "actualsub" is not available', function() {
			const token = new BrightspaceAuthToken({
				sub: '123'
			}, 'x.y.z');

			expect(token.actualUser).to.equal('123');
		});

		it('should be "undefined" when there is no "sub" or "actualsub"', function() {
			const token = new BrightspaceAuthToken({}, 'x.y.z');

			expect(token.actualUser).to.be.undefined;
		});
	});
});
