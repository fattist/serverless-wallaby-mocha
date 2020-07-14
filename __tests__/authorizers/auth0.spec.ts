/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */

const sinon = require('sinon');

import { expect } from 'chai';
import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';

import { authorize, authenticateToken, decodeToken, generatePolicy, getSigningKey, stripTokenFromHeader } from '@authorizers/auth0';
import { Responses as lang } from '@i18n/authorizer';

describe('auth0-authorizer', () => {
    const sandbox = sinon.createSandbox();

    afterEach(function () {
        sandbox.restore();
    });

    describe('authorize', () => {
        xit('should successfully authenticate token', () => {
            sandbox.stub(jwt, 'decode').returns({ header: { kid: 'foo' } });
            sandbox.stub(jwt, 'verify').returns(null, { sub: 'foo' });
        });
    });

    describe('authenticateToken', () => {
        const sandbox = sinon.createSandbox();
        const authClient = jwksClient({
            cache: true,
            jwksUri: `https://${process.env.A0_DOMAIN}/.well-known/jwks.json`
        });

        afterEach(function () {
            sandbox.restore();
        });

        it('should return error', () => {
            sandbox.stub(authClient, 'getSigningKey').yields(true);
            const callback = sinon.spy();

            authenticateToken(authClient, 'foo', 'bar', { methodArn: true }, callback);
            expect(callback.getCall(0).args).to.include(lang.ERROR);
        });

        it('should return error', () => {
            const authToken = 'foo';

            sandbox.stub(authClient, 'getSigningKey').yields(null, { publicKey: 'foo' });
            sandbox.stub(jwt, 'verify').yields(true);

            const callback = sinon.spy();

            authenticateToken(authClient, authToken, 'bar', { methodArn: 'arn:aws:execute-api:us-west-2:xxx:xxx/*/GET/' }, callback);

            expect(callback.getCall(0).args).to.include(lang.UNAUTHORIZED);
        });

        it('should return policy', () => {
            const authToken = 'foo';
            const opts = { sub: 'foo' };
            const payload = {
                context: opts,
                policyDocument: {
                    Version: '2012-10-17',
                    Statement: [{
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: 'arn:aws:execute-api:us-west-2:xxx:xxx/*/*',
                    }]
                },
                principalId: opts.sub
            };

            sandbox.stub(authClient, 'getSigningKey').yields(null, { publicKey: 'foo' });
            sandbox.stub(jwt, 'verify').yields(null, { sub : 'foo' });

            const callback = sinon.spy();

            authenticateToken(authClient, authToken, 'bar', { methodArn: 'arn:aws:execute-api:us-west-2:xxx:xxx/*/GET/' }, callback);

            expect(callback.getCall(0).args).to.deep.equal([null, payload]);
        });

        it('should return exception', () => {
            sandbox.stub(authClient, 'getSigningKey').yields(null, { publicKey: 'foo' });
            sandbox.stub(jwt, 'verify').throws(new TypeError());

            const callback = sinon.spy();

            authenticateToken(authClient, 'foo', 'bar', { methodArn: true }, callback);
            expect(callback.getCall(0).args).to.include(lang.ERROR);
        });
    });

    describe('decodeToken', () => {
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

        it('should return unauthorized', () => {
            sandbox.stub(jwt, 'decode').returns(false);
            const callback = sinon.spy();

            decodeToken('token', callback);
            expect(callback.getCall(0).args).to.include(lang.UNAUTHORIZED);
        });

        it('should return successfully', () => {
            sandbox.stub(jwt, 'decode').returns(true);
            const callback = sinon.spy();

            expect(decodeToken('token', callback)).to.be.true;
        });
    });

    describe('generatePolicy', () => {
        it('should return a principalId', () => {
            const opts = { sub: 'foo' };
            const policy = generatePolicy(opts);

            expect(policy).to.deep.equal({ principalId: opts.sub });
        });

        it('should return full payload', () => {
            const opts = { sub: 'foo' };
            const policy = generatePolicy(opts, 'bar', 'arn:aws:execute-api:us-west-2:xxx:xxx/*/GET/');
            const payload = {
                context: opts,
                policyDocument: {
                    Version: '2012-10-17',
                    Statement: [{
                        Action: 'execute-api:Invoke',
                        Effect: 'bar',
                        Resource: 'arn:aws:execute-api:us-west-2:xxx:xxx/*/*',
                    }]
                },
                principalId: opts.sub
            };

            expect(policy).to.deep.equal(payload);
        });
    });

    describe('getSigningKey', () => {
        it('should return a publicKey', () => {
            const payload = { publicKey: 'foo' };

            console.log(getSigningKey(payload));
            expect(getSigningKey(payload)).to.equal(payload.publicKey);
        });

        it('should return a rsaPublicKey', () => {
            const payload = { rsaPublicKey: 'foo' };

            console.log(getSigningKey(payload));
            expect(getSigningKey(payload)).to.equal(payload.rsaPublicKey);
        });
    });

    describe('stripTokenFromHeader', () => {
        it('should return unauthorized, without authorizationToken', () => {
            const callback = sinon.spy();

            stripTokenFromHeader({}, callback);
            expect(callback.getCall(0).args).to.include(lang.UNAUTHORIZED);
        });

        it('should return unauthorized, with misformatted authorizationToken', () => {
            const callback = sinon.spy();

            stripTokenFromHeader({ authorizationToken: 'foo' }, callback);
            expect(callback.getCall(0).args).to.include(lang.UNAUTHORIZED);
        });

        it('should return unauthorized, with correctly formatted authorizationToken', () => {
            const callback = sinon.spy();
            const bearerToken = 'Bearer foo'
            const token = stripTokenFromHeader({ authorizationToken: bearerToken }, callback);

            expect(token).to.equal('foo');
        });
    });
});