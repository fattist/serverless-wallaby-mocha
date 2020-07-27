import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

const ISOdate = (d = new Date()) => d.toISOString();

@table('users')
export class Schema {
    @hashKey()
    email: string;

    @attribute()
    sub: string;

    @attribute({ defaultProvider: () => ISOdate })
    createdAt: string;
}