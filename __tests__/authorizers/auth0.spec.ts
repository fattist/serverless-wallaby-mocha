/* eslint-disable @typescript-eslint/no-var-requires */

const sinon = require('sinon');

// import { authorize, decodeToken } from '@authorizers/auth0';
import { expect } from 'chai';
// import { SigningKeyNotFoundError } from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';

import { decodeToken } from '@authorizers/auth0';
import { Responses as lang } from '@i18n/authorizer';

describe('auth0-authorizer', () => {
    describe('decode', () => {
        const sandbox = sinon.createSandbox();

        afterEach(function () {
            sandbox.restore();
        });

        it('should return error', () => {
            sandbox.stub(jwt, 'decode').throws(new Error());
            const callback = sinon.spy();

            decodeToken('token', callback);
            expect(callback.getCall(0).args).to.include(lang.ERROR);
        });

        it('should execute callback function', () => {
            sandbox.stub(jwt, 'decode').returns(false);
            const callback = sinon.spy();

            decodeToken('token', callback);
            expect(callback.getCall(0).args).to.include(lang.UNAUTHORIZED);
        });

        it('should return successfully', () => {
            sandbox.stub(jwt, 'decode').returns(true);
            const callback = sinon.spy();

            const ctx = decodeToken('token', callback);
            expect(ctx).to.be.true;
        });
    });
});