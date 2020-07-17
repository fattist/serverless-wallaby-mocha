/* eslint-disable @typescript-eslint/no-var-requires */

import { A0 } from '@services/auth0';

const sinon = require('sinon');

import { expect } from 'chai';

describe('a0', () => {
    const sandbox = sinon.createSandbox();

    afterEach(function () {
        sandbox.restore();
    });

    describe('me', () => {
        let client;
    
        beforeEach(function() {
            const bearerToken = 'foo';
            client = new A0('mhp.us.auth0.com', bearerToken);
        });

        it('should return userinfo', async () => {
            let ctx;
            sandbox.stub(client, 'me').resolves({
                sub: 'foo',
                nickname: 'bar',
                name: 'baz',
                picture: 'foo',
                updated_at: new Date(),
                email: 'bar',
                email_verified: true
            });

            try {
                ctx = await client.me();
            } catch (error) {
                console.log(error);
            } finally {
                expect(ctx).to.haveOwnProperty('email');
            }
        });

        it('should reject promise', async () => {
            try {
                sandbox.stub(client, 'me').rejects(new Error());

                await client.me();
            } catch (error) {
                expect(error).to.be.an('error');
            }
        });
    });
});