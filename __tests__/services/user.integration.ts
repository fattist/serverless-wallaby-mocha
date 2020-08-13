/* eslint-disable @typescript-eslint/no-var-requires */
const sinon = require('sinon');

import { expect } from 'chai';

import { User } from '@services/user';

describe.skip('user', () => {
    let klass, payload;

    const sandbox = sinon.createSandbox();

    afterEach(function () {
        sandbox.restore();
    });

    beforeEach(function(done) {
        payload = { email: 'foo@bar.baz', phone: '+19995551111' };
        klass = new User();

        const tableExists = klass.ensureTableExists();
        const suiteRecord = klass.execute('put', payload);

        Promise.all([tableExists, suiteRecord]).then(() => {
            done();
        });
    });

    describe('delete', () => {
        it('should delete record', (done) => {
            const payload = { email: 'faz@bar.boo', phone: '+19995551111' };
            const put = klass.execute('put', payload);
            const del = klass.execute('delete', { email: payload.email });

            Promise.all([put, del]).then(results => {
                expect(results[results.length - 1].email).to.equal(payload.email);
                done();
            });
        });

       it('should return error', async () => {
            try {
                await klass.execute('delete', { foo: 'bar@baz' });
            } catch (error) {
                expect(error.message).to.equal('Field does not match requirements: [email, undefined]');
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
        it('should return record by full payload', async () => {
            let record;

            try {
                record = await klass.execute('get', payload);
            } catch (error) {
                console.log(error);
                return;
            }

            expect(record.email).to.equal(payload.email);
        });

        it('should return record by email', async () => {
            let record;
            const p = { email: 'foo@bar.baz' };

            try {
                record = await klass.execute('get', p);
            } catch (error) {
                console.log(error);
                return;
            }

            expect(record.email).to.equal(payload.email);
        });

        it('should return error due to no valid parameters', async () => {
            const payload = { foo: 'bar' };

            try {
                await klass.execute('get', payload);
            } catch (error) {
                expect(error.message).to.equal('Field does not match requirements: [email, undefined]');
            }
        });
    });

    describe('put', () => {
        it('should write record', async () => {
            let record;
            const email = 'foo@bar.baz';
            const phone = '+19995551111';

            try {
                record = await klass.execute('put', { email, phone });
            } catch (error) {
                console.error(error);
            }

            expect(record.email).to.equal(email);
        });

        it('should violate email format requirement', async () => {
            let record;
            const email = 'baz@bar';
            const phone = '+19995551111';

            try {
                record = await klass.execute('put', { email, phone });
            } catch (error) {
                expect(error.message).to.equal(`Field does not match requirements: [email, ${email}]`);
            }

            console.log(record);
        });

        it('should violate phone format requirement', async () => {
            const email = 'baz@bar.foo';
            const phone = '+828282';

            try {
                await klass.execute('put', { email, phone });
            } catch (error) {
                console.log(error);
                expect(error.message).to.equal(`Field does not match requirements: [phone, ${phone}]`);
            }
        });
    });

    describe('update', () => {
        it('should update record', async () => {
            let record;
            const phone = '+10005551111';
            const sub = 'test|0987654321';

            try {
                record = await klass.execute('update', { email: payload.email, phone, sub });
            } catch (error) {
                console.log(error);
                return;
            }

            expect(record.sub).to.equal(sub.toString());
        });

        it('should violate phone requirement', async () => {
            const sub = 'test|1234567890';

            try {
                await klass.execute('update', { email: payload.email, sub });
            } catch (error) {
                console.log(error);
                expect(error.message).to.equal(`Field does not match requirements: [phone, undefined]`);
            }
        });

        it('should violate sub requirement', async () => {
            const phone = '+10005551111';

            try {
                await klass.execute('update', { email: payload.email, phone });
            } catch (error) {
                console.log(error);
                expect(error.message).to.equal(`Field does not match requirements: [sub, undefined]`);
            }
        });
    });
});