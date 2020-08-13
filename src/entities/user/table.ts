import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

@table('users')
export class Schema {
    @hashKey()
    email!: string;

    @attribute()
    sub!: string;

    // NOTE: PII, non-persisted
    name?: string;
    password!: string;
    phone!: string;
}