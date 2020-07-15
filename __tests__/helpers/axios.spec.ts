/* eslint-disable @typescript-eslint/no-var-requires */

const sinon = require('sinon');

import { AxiosResponse } from 'axios';
import { expect } from 'chai';
import { HttpClient } from '@helpers/axios/http';

describe('axios', () => {
    const sandbox = sinon.createSandbox();

    class Klass extends HttpClient {
        constructor(domain: string) {
            super(`https://${domain}`);
        }

        public get = (): Promise<AxiosResponse<any>> => this.instance.get('/');
    }

    afterEach(function () {
        sandbox.restore();
    });

    describe('http', () => {
        it('should return a promise', async () => {
            const foo = new Klass('foo');
            sandbox.stub(foo, 'get').resolves(true);
            let test;

            try {
                test = await foo.get();
            } catch (error) {
                console.error(error);
            } finally {
                expect(test).to.be.true;
            }
        });
    });
})