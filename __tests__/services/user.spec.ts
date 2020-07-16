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
            const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVRajlXV05CYXBOV2xzbUw5V2VxOCJ9.eyJpc3MiOiJodHRwczovL21ocC51cy5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWYwZDIyYzUyZWIzMDMwMDE5Yzg3MzNjIiwiYXVkIjpbImh0dHBzOi8vbWhwLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9taHAudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTU5NDgzNjA3OSwiZXhwIjoxNTk0OTIyNDc5LCJhenAiOiJGem82MnRpOHJwQ2E3TWladUZQYjg3Vm9wc3BoejRQZSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgYWRkcmVzcyBwaG9uZSByZWFkOmN1cnJlbnRfdXNlciB1cGRhdGU6Y3VycmVudF91c2VyX21ldGFkYXRhIGRlbGV0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgY3JlYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBjcmVhdGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyBkZWxldGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyB1cGRhdGU6Y3VycmVudF91c2VyX2lkZW50aXRpZXMiLCJndHkiOiJwYXNzd29yZCJ9.cBOe6K7OnCdXJjgi-C4cnirzwAiWA61yazCDh4KOFSqv5ZlD5oa0U5EamvvzNu_2EtGHyIaiazaqJmPYp03-ST7bGoYw8BOa3-enTuBUgldMkF1gQ00DhYFECRvRj00nWDgV6qzDI16VavzHHEOGY-P3eoY6Ost1e7wJ1NZU24nxjhSIkVjuDo_bZhB4h437mzkIClqHdcVQbqrF-Wx2zpp3v0P1I_0HVOGgvtcqkrZPYKdSfG5Q33BROMS_N7co5AlgFmVMeX7USoC3R4pcGMzolEkGRfYjrSAd9D-bBEyBuBRZCNvbUSlxQNglc_wS9xGuhRem9hwhiIqbEvQr7g';
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