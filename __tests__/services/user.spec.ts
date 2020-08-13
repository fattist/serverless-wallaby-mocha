/* eslint-disable @typescript-eslint/no-var-requires */
const sinon = require('sinon');

import { expect } from 'chai';

import { httpWrapper as Http } from '@services/http';
import { User as user } from '@services/user';

describe('user', () => {
    const sandbox = sinon.createSandbox();

    afterEach(function () {
        sandbox.restore();
    });

    describe('auth', () => {
        it('promise should resolve', async () => {
            let response;
            const payload = { mfa_token: 'foo' };

            sandbox.stub(Http.prototype, 'post').resolves(payload);

            try {
                response = await user.auth('foo@bar.baz', 'qux');
            } catch (error) {
                console.log(error);
            } finally {
                expect(response).to.equal(payload.mfa_token);
            }
        });

        it('promise should reject, but forward mfa_challenge', async () => {
            let response;
            const exception = {
                error: 'mfa_required',
                mfa_token: 'foo'
            }

            sandbox.stub(Http.prototype, 'post').rejects(exception);

            try {
                response = await user.auth('foo@bar.baz', 'qux');
            } catch (error) {
                console.log(error);
            } finally {
                expect(response).to.equal(exception.mfa_token);
            }
        });

        it('promise should reject', async () => {
            const exception = { error: 'foo' };

            sandbox.stub(Http.prototype, 'post').rejects(exception);

            try {
                await user.auth('foo@bar.baz', 'qux');
            } catch (error) {
                expect(error).to.deep.equal(exception);
            }
        });
    });

    describe('oauth', () => {
        it('promise should resolve', async () => {
            let request;
            sandbox.stub(Http.prototype, 'post').resolves(true);

            try {
                request = await user.oauth('foo', 'bar', 'baz');
            } catch (error) {
                console.log(error);
            } finally {
                expect(request).to.be.true;
            }
        });

        it('promise should reject', async () => {
            sandbox.stub(Http.prototype, 'post').rejects(false);

            try {
                await user.oauth('foo', 'bar', 'baz');
            } catch (error) {
                expect(error).to.be.throw;
            }
        });
    });

    describe('oob', () => {
        it('promise should resolve', async () => {
            let request;
            sandbox.stub(Http.prototype, 'post').resolves({ oob_code: 'foo' });

            try {
                request = await user.oob('bar');
            } catch (error) {
                console.log(error);
            } finally {
                expect(request).to.equal('foo');
            }
        });

        it('promise should reject', async () => {
            let request;
            sandbox.stub(Http.prototype, 'post').rejects(false);

            try {
                request = await user.oob('bar');
            } catch (error) {
                expect(request).to.be.throw;
            }
        });
    });
});