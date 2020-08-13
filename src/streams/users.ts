/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

const lambda = new AWS.Lambda();
const step = new AWS.StepFunctions();

export const stream = (event, context): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            event.Records.forEach(async (record, idx) => {
                let params;

                if (!idx) {
                    if (record.dynamodb.NewImage) {
                        params = {
                            stateMachineArn: process.env.REGISTRATION_ARN,
                            input: JSON.stringify(record),
                            name: uuid()
                        }

                        step.startExecution(params, (error, data) => {
                            if (error) {
                                return reject(error);
                            }

                            resolve(data);
                        });
                    } else {
                        return resolve();
                    }
                } else {
                    event.Records = [record];
                    params = {
                        FunctionName: context.functionName,
                        InvocationType: 'Event',
                        Payload: JSON.stringify(event),
                        Qualifier: context.functionVersion
                    }

                    const invoke = lambda.invoke(params).promise();
                    invoke.then(resolve).catch(reject);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}
