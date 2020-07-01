import { hello } from '@services/hello';
import { expect } from 'chai';

describe('suite', () => {
    it('test', () => {
        expect(hello.response).to.equal('Hello World');
    });
});