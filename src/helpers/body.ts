export const parse = (payload: string): string => {
    // NOTE: lambda proxy can pass event.body with UTF-8 encoding (\n, \\)
    const { query } = JSON.parse(payload);
    return query.replace(/(\\n?)/g, '').replace(/[\s]{2,}/g, ' ');
}