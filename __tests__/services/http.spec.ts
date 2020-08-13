/* eslint-disable @typescript-eslint/no-var-requires */

const sinon = require('sinon');

import { expect } from 'chai';

import { httpWrapper as https } from '@services/http';

describe('http', () => {
    const sandbox = sinon.createSandbox();

    afterEach(function () {
        sandbox.restore();
    });

    describe('get', () => {
        it('promise should resolve', async () => {
            let request;
            const klass = new https('foo.bar');
            sandbox.stub(klass, 'get').resolves(true);

            try {
                request = await klass.get('/baz');
                console.log(request);
            } catch (error) {
                console.log(error);
            } finally {
                expect(request).to.equal(true);
            }
        });

        it('promise should reject', async () => {
            let request;
            const klass = new https('foo.bar');
            sandbox.stub(klass, 'get').rejects(false);

            try {
                request = await klass.get('/baz');
                console.log(request);
            } catch (error) {
                console.log(error);
                expect(request).to.have.throw;
            }
        });
    });
})