import { expect } from 'chai';

import { schema as types } from '@entities/user/schema';

describe('user', () => {
    describe('types', () => {
        it('verify query type exists', () => {
            expect(types.getQueryType().toString()).to.equal('Query');
            expect(types.getTypeMap().User).to.exist
        });
    });
});