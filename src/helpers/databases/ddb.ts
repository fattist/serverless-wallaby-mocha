import { DataMapper } from '@aws/dynamodb-data-mapper';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';

import { dynamodb as config } from '@helpers/config';

export abstract class DynamoClient {
    protected readonly connection: DataMapper;

    constructor(endpoint = config.endpoint, region = config.region) {
        this.connection = new DataMapper({
            client: new DynamoDB({
                endpoint: endpoint,
                region: region
            })
        });
    }
}