/* eslint-disable @typescript-eslint/no-var-requires */
const sinon = require('sinon');

import { expect } from 'chai';

import { User } from '@services/user';

describe.skip('user', () => {
    let klass;
    let payload;

    const sandbox = sinon.createSandbox();

    afterEach(function () {
        sandbox.restore();
    });

    beforeEach(function(done) {
        payload = { email: 'foo@bar.baz', sub: +new Date() };
        klass = new User();

        const tableExists = klass.ensureTableExists();
        const suiteRecord = klass.execute('put', payload);

        Promise.all([tableExists, suiteRecord]).then(() => {
            done();
        });
    });

    describe('delete', () => {
        it('should delete record', (done) => {
            const payload = { email: 'faz@bar.boo', sub: +new Date() };
            const put = klass.execute('put', payload);
            const del = klass.execute('delete', payload)

            Promise.all([put, del]).then(results => {
                expect(results[results.length - 1].email).to.equal(payload.email);
                done();
            });
        });

       it('should return error', async () => {
            const payload = { foo: 'bar@foo.baz', sub: +new Date() };

            try {
                await klass.execute('delete', payload);
            } catch (error) {
                expect(error.code).to.equal('ValidationException');
            }
        });
    });

    describe('query', () => {
        it('should return list of record(s)', async () => {
            let records;
        
            try {
                records = await klass.query({ email: payload.email });
            } catch (error) {
                console.log(error);
                return;
            }

            expect(records).to.have.lengthOf(1);
            expect(records[0].email).to.be.equal(payload.email);
        });
    });

    describe('get', () => {
        it('should return record', async () => {
            let record;

            try {
                record = await klass.execute('get', payload);
            } catch (error) {
                console.log(error);
                return;
            }

            expect(record.email).to.equal(payload.email);
        });

        it('should return error', async () => {
            const payload = { foo: 'bar' };

            try {
                await klass.execute('get', payload);
            } catch (error) {
                expect(error.code).to.equal('ValidationException');
            }
        });
    });

    describe('put', () => {
        it('should write record', async () => {
            let record;
            const email = 'baz@bar.foo';
            const sub = +new Date();

            try {
                record = await klass.execute('put', { email: email, sub: sub });
            } catch (error) {
                console.log(error);
                return;
            }

            expect(record.email).to.equal(email);
        });
    });

    describe('update', () => {
        it('should update record', async () => {
            let record;
            const sub = +new Date();

            try {
                record = await klass.execute('update', { email: payload.email, sub: sub });
            } catch (error) {
                console.log(error);
                return;
            }

            expect(record.sub).to.equal(sub.toString());
        });
    });
});