/* eslint-disable @typescript-eslint/no-var-requires */
const sinon = require('sinon');

import * as AWS from 'aws-sdk';
import { expect } from 'chai';

import { stream } from '@streams/users';

describe('user stream', () => {
    const sandbox = sinon.createSandbox();

    afterEach(function () {
        sandbox.restore();
    });

    describe('fn', () => {
        it('should resolve true', async () => {
            const timestamp = +new Date();
            const event = {
                Records: [{
                    dynamodb: {
                        NewImage: {
                            sub: { S: timestamp },
                            email: { S: 'foo@bar.baz' }
                        }
                    }
                }]
            };
            const context = {
                functionName: 'foo',
                functionVersion: 'bar'
            }

            const ctx = await stream(event, context);
            expect(ctx).to.deep.equal({ sub: { S: timestamp }, email: { S: 'foo@bar.baz' } });
        });
        xit('should recursively call fn with second child of payload', async () => {
            // TODO: confused on how to stub inner AWS SDK call
            const context = { functionName: 'foo', functionVersion: 'bar' }
            const event = {
                Records: [{
                    dynamodb: {
                        NewImage: {
                            sub: { S: '1' },
                            email: { S: 'foo@bar.baz' }
                        }
                    }
                }, {
                    dynamodb: {
                        NewImage: {
                            sub: { S: '2' },
                            email: { S: 'baz@bar.foo' }
                        }
                    }
                }]
            };

            const lambda = new AWS.Lambda();
            sinon.stub(lambda, 'invoke').withArgs({
                FunctionName: context.functionName,
                InvocationType: 'Event',
                Payload: JSON.stringify(event),
                Qualifier: context.functionVersion
            }).returns({
                promise: () => ({
                    AcceptRanges: 'bytes',
                    LastModified: new Date('2018-04-25T13:32:58.000Z'),
                    ContentLength: 23,
                    ETag: '"ae771fbbba6a74eeeb77754355831713"',
                    ContentType: 'text/plain',
                    Metadata: {},
                    Body: Buffer.from('Test file\n')
                })
            });

            const ctx = await stream(event, context);
            expect(ctx).to.deep.equal({ sub: { S: '1' }, email: { S: 'foo@bar.baz' } });
        });
    });
});