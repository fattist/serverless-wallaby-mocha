import { Response } from '@helpers/interfaces/all';

function replaceErrors(_key, value, error = {}) {
    if (value instanceof Error) {
        Object.getOwnPropertyNames(value).forEach(function (key) {
            error[key] = value[key];
        });

        return error;
    }

    return value;
}

export const response = (code: number, body: unknown, error = false): Response => ({
    statusCode: code,
    body: JSON.stringify(body, error ? replaceErrors : null, 2)
});