import { Routes as _routes } from '@i18n/routes';

export const contentTypeCheck = (header: string, type: string): void => {
    if (header !== type) {
        throw new Error(_routes.CONTENT_TYPE.replace('__', type));
    }
}