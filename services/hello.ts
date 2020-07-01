import 'source-map-support/register';

interface Hello {
    [key: string]: string
}

export const hello: Hello = {
    response: 'Hello World'
}