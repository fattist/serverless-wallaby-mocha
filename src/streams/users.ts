/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as AWS from 'aws-sdk';

const lambda = new AWS.Lambda();

export const stream = (event, context): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            event.Records.forEach(async (record, idx) => {
                if (!idx) {
                    console.log('trigger', record.dynamodb.NewImage);
                    resolve(record.dynamodb.NewImage);
                } else {
                    event.Records = [record];
                    const params = {
                        FunctionName: context.functionName,
                        InvocationType: 'Event',
                        Payload: JSON.stringify(event),
                        Qualifier: context.functionVersion
                    }

                    const invoke = lambda.invoke(params).promise();
                    invoke.then(data => {
                        resolve(data);
                    }).catch(reject);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}
